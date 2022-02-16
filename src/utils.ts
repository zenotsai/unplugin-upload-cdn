import path from 'path'
import chalk from 'chalk'

export const log = (msg: string) => {
  // eslint-disable-next-line
  console.log(`${chalk.bgMagenta('unplugin-upload-cdn')} ${msg}`)
}

export class NpmUtils {
  pkg: {
    [key: string]: string
  }

  constructor(pwd: string = process.env.PWD!) {
    // eslint-disable-next-line
    this.pkg = require(path.resolve(pwd, "package.json"));
  }

  getProjectName = () => {
    return this.pkg.name
  }

  getVersion = () => {
    return this.pkg.version
  }
}
