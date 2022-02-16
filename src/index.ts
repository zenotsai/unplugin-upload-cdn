import path from 'path'
import { createUnplugin } from 'unplugin'
import fs from 'fs-extra'
import pLimit from 'p-limit'
import globby from 'globby'
import { log, NpmUtils } from './utils'

import { IOptions, IResource } from './types'

export { default as COS } from './cos'
export { default as OSS } from './oss'

const limit = pLimit(500)

function getFileKey(prefix: string, filePath: string, useVersion?: boolean) {
  const npmUtils = new NpmUtils()
  const base = prefix || npmUtils.getProjectName()
  if (useVersion) {
    const version = npmUtils.getVersion()
    if (version)
      return path.join(base, version, filePath)
  }

  return path.join(base, filePath)
}

export const unpluginUploadCDN = createUnplugin<IOptions>(options => ({
  name: 'unplugin-upload-cdn',
  buildEnd: async () => {
    if (!options)
      throw new Error('missing configuration')

    const {
      dir,
      provider,
      ignore = [],
      useVersion = Boolean(process.env.CDN_PLUGIN_USE_VERSION),
      prefix = '',
      existCheck = Boolean(process.env.CDN_PLUGIN_EXIST_CHECK),
    } = options
    const paths: string[] = await globby(dir, {
      ignore: ['*', ...ignore],
    })
    let resList: IResource[] = paths.map(filePath => ({
      path: filePath,
      key: getFileKey(prefix, filePath, useVersion),
    }))

    resList = await provider.beforeUpload(resList, existCheck)

    const files = resList.map((res) => {
      return {
        path: res.path,
        key: res.key,
        stat: fs.statSync(res.path),
        content: fs.createReadStream(res.path),
      }
    })
    log('Start uploading...')
    await Promise.all(files.map((file) => {
      return limit(() => provider.upload(file))
    }))
    log('======= End =========')
  },
}))
