/* eslint-disable */
// @ts-nocheck
import path from 'path'
import COS, { COSOptions } from 'cos-nodejs-sdk-v5'
import NpmUtils from '../npmUtils'
import { IProvider } from '../types';
import md5File from 'md5-file';

export interface IFile {
  path: string
  content: Buffer
}




interface ICOSConfig extends COSOptions {
  Bucket: string;
  Region: string;
  cosBaseDir: string;
  projectDir?: string;
  useVersion?: boolean;
  existCheck?: boolean;
}

class COSProvider implements IProvider {
  cosClient: typeof COS
  cosConfig: ICOSConfig
  prefix: string
  constructor(config: ICOSConfig) {
    this.cosConfig = Object.assign({
      SecretId: process.env.CDN_PLUGIN_SECRET_ID,
      SecretKey: process.env.CDN_PLUGIN_SECRET_KEY,
      Bucket: process.env.CDN_PLUGIN_BUCKET,
      Region: process.env.CDN_PLUGIN_REGION,
    }, config)
    this.cosClient = new COS(this.cosConfig)
    this.prefix = this.getPrefix();
  }

  getPrefix = () => {
    const npmUtils = new NpmUtils();
    const { useVersion, cosBaseDir = '/', projectDir } = this.cosConfig;
    const projectName = projectDir || npmUtils.getProjectName();
    if (useVersion) {
      const version = npmUtils.getVersion();
      if (version) {
        return path.join(cosBaseDir, projectName, version)
      }
    }

    return path.join(cosBaseDir, projectName)
  }

  async getAssetInfo(fileName, outputPath) {
    try {
      const fullPath = `${outputPath}/${fileName}`;
      const hash = await md5File(fullPath);
      return {
        Key: fileName,
        ETag: hash,
      };
    } catch (err) {
      throw new Error(err);
    }
  }


  beforeUpload = async (files: string[]) => {
    const { existCheck } = this.cosConfig;
    if (!existCheck) {
      return Promise.resolve(files)
    }
    return Promise.all(files.map((f) => this.getBucket(f.path))).then((res) => {
      return res.filter((r) => {
        if (r.Contents && r.Contents.length > 0) {
          console.log('已存在，不重复上传')
          return false;
        }
        return true
      }).map(i => i.Key)
    })

  }
  getBucket = (key: string) => {
    const { Bucket, Region } = this.cosConfig;
    return new Promise((resolve, reject) => {
      this.cosClient.getBucket({
        Prefix: key,
        MaxKeys: 1,
        Bucket,
        Region
      },
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        })
    });
  }



  upload = (file: IFile) => {
    console.log('开始上传', file.path)
    return getFileContentBuffer(file, null).then((body) => {
      const Key = path.join(this.prefix, file.path)
      const { Bucket, Region } = this.cosConfig;
      this.cosClient.putObject({
        Bucket,
        Region,
        Key,
        Body: body,
      }, (err, data) => {
        console.log(err || data);
        if (err) {
          console.log('上传失败')
        }
        if (data.statusCode === 200) {
          console.log('上传成功')
        }
      })
    })
  }
}

export default COSProvider
