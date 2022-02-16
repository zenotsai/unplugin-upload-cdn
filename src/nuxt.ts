import { IOptions } from './types'
import { unpluginUploadCDN } from '.'

export default function (this: any, options: IOptions) {
  // install webpack plugin
  this.extendBuild((config: any) => {
    config.plugins = config.plugins || []
    config.plugins.unshift(unpluginUploadCDN.webpack(options))
  })

  // install vite plugin
  this.nuxt.hook('vite:extend', async (vite: any) => {
    vite.config.plugins = vite.config.plugins || []
    vite.config.plugins.push(unpluginUploadCDN.vite(options))
  })
}
