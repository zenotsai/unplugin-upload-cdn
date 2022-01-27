import { createUnplugin } from 'unplugin'
import fs from 'fs-extra'
import pLimit from 'p-limit'
import globby from 'globby'
import { Options } from './types'

export { default as COS } from './provider/cos'

// function getFileContentBuffer(file: IFile, gzipVal: number) {
//   const gzip = !!(typeof gzipVal === 'number' || gzipVal === true)
//   const opts = typeof gzipVal === 'number' ? { level: gzipVal } : {}
//   if (!gzip) {
//     return Promise.resolve(
//       Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content),
//     )
//   }
//   return new Promise((resolve, reject) => {
//     zlib.gzip(
//       Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content),
//       opts,
//       (err, gzipBuffer) => {
//         if (err) reject(err)
//         resolve(gzipBuffer)
//       },
//     )
//   })
// }

const limit = pLimit(500)

export default createUnplugin<Options>(options => ({
  name: 'unplugin-starter',
  buildEnd: async (error: Error) => {
    if (!options)
      throw new Error('missing configuration')

    if (error)
      throw error

    const { dir, provider, ignore = [] } = options
    let paths: string[] = await globby(dir, {
      ignore: ['*', ...ignore],
    })

    paths = await provider.beforeUpload(paths)

    const files = paths.map((file) => {
      return {
        path: file,
        content: fs.createReadStream(file),
      }
    })

    await Promise.all(files.map((file) => {
      return limit(() => provider.upload(file))
    }))
  },
}))
