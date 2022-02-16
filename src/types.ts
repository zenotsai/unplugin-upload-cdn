import { ReadStream, Stats } from 'fs'
export interface IFile {
  path: string
  content: ReadStream
  stat: Stats
  key: string
}

export interface IResource {
  path: string
  key: string
}

export interface IProvider {
  upload: (file: IFile) => void
  beforeUpload: (files: IResource[], existCheck?: boolean) => Promise<IResource[]>
}

export interface IOptions {
  // define your plugin options here
  existCheck?: boolean
  dir: string
  ignore?: string[]
  provider: IProvider
  useVersion?: boolean
  prefix?: string
}
