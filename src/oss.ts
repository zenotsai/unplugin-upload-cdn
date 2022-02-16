
import path from 'path'
import OSS from 'ali-oss'
import chalk from 'chalk'
import logSymbols from 'log-symbols'
import filesize from 'filesize'
import { IProvider, IFile, IResource } from './types'
import { log } from './utils'

interface IOSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

class OSSProvider implements IProvider {
  client: OSS
  config: IOSSConfig
  constructor(config: IOSSConfig) {
    this.config = Object.assign({
      accessKeyId: process.env.CDN_PLUGIN_ACCESSKEY_ID,
      accessKeySecret: process.env.CDN_PLUGIN_SECRET,
      bucket: process.env.CDN_PLUGIN_BUCKET,
      region: process.env.CDN_PLUGIN_REGION,
    }, config)
    this.client = new OSS(config)
  }

  upload = async (file: IFile) => {
    const key = file.key
    log(`OSS Uploading[${chalk.gray(filesize(file.stat.size, { base: 2 }))}]: ${key}`)
    return this.client.put(key, path.normalize(file.path)).then((data) => {
      if (data?.res.status === 200)
        log(`${chalk.green('OSS [Successed]')} ${logSymbols.success} ${key}`)
      else
        log(`${chalk.red('[Error]')} ${logSymbols.error} ${key}`)
    })
  }

  isExistObject = async (res: IResource): Promise<{
    isExist: boolean
    res: IResource
  }> => {
    const key = res.key
    try {
      await this.client.head(key)
      log(`${chalk.red('OSS [Existed]')}: ${key}`)
      return { isExist: true, res }
    }
    catch (error: any) {
      return { isExist: false, res }
    }
  }

  beforeUpload = async (files: IResource[], existCheck?: boolean) => {
    if (!existCheck)
      return Promise.resolve(files)

    return Promise.all(files.map(f => this.isExistObject(f))).then((res) => {
      return res.filter((r) => {
        return !r?.isExist
      }).map((i) => {
        return i.res
      })
    })
  }
}

export default OSSProvider
