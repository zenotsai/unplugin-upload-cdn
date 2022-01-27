import path from 'path'

export default class NpmUtils {
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
