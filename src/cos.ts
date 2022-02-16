import COS, { COSOptions } from 'cos-nodejs-sdk-v5'
import filesize from 'filesize'
import chalk from 'chalk'
import logSymbols from 'log-symbols'

import { log } from './utils'
import { IProvider, IResource, IFile } from './types'

interface ICOSConfig extends COSOptions {
  Bucket: string
  Region: string
}

class COSProvider implements IProvider {
  client: COS
  cosConfig: ICOSConfig
  constructor(config: ICOSConfig) {
    this.cosConfig = Object.assign({
      SecretId: process.env.CDN_PLUGIN_SECRET_ID,
      SecretKey: process.env.CDN_PLUGIN_SECRET_KEY,
      Bucket: process.env.CDN_PLUGIN_BUCKET,
      Region: process.env.CDN_PLUGIN_REGION,
    }, config)
    this.client = new COS(this.cosConfig)
  }

  beforeUpload = async (resList: IResource[], existCheck?: boolean) => {
    if (!existCheck)
      return Promise.resolve(resList)

    return Promise.all(resList.map(f => this.isExistObject(f))).then((res) => {
      return res.filter((r) => {
        return !r?.isExist
      }).map((i) => {
        return i.res
      })
    })
  }

  isExistObject = (res: IResource): Promise<{
    isExist: boolean
    res: IResource
  }> => {
    const { Bucket, Region } = this.cosConfig
    return new Promise((resolve, reject) => {
      this.client.headObject({
        Bucket,
        Region,
        Key: res.key,
      }, (err, data) => {
        if (data) {
          log(`${chalk.red('[Existed]')}: ${res.key}`)
          resolve({
            isExist: true, res,
          })
          return
        }
        if (err && Number(err.code) === 404) {
          resolve({
            isExist: false, res,
          })
          return
        }
        if (err && Number(err.code) === 403) {
          log(chalk.red(` No read access ${res.key}`))
          resolve({
            isExist: false, res,
          })
        }
        reject(err)
      })
    })
  }

  upload = (file: IFile) => {
    const { key } = file
    log(`COS Uploading[${chalk.gray(filesize(file.stat.size, { base: 2 }))}]: ${key}`)
    const { Bucket, Region } = this.cosConfig
    return new Promise((resolve, reject) => {
      this.client.putObject({
        Bucket,
        Region,
        Key: key,
        Body: file.content,
      }, (err, data) => {
        if (err) {
          log(`${chalk.red('COS [Error]')} ${logSymbols.error} ${key}`)
          reject(err)
        }

        if (data.statusCode === 200) {
          log(`${chalk.green('COS [Successed]')} ${logSymbols.success} ${key}`)
          resolve(1)
        }
      })
    })
  }
}

export default COSProvider
