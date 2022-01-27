import { ReadStream } from 'fs'
export interface IFile {
  path: string
  content: ReadStream
}

export interface IProvider {
  upload: (file: IFile) => void
  beforeUpload: (files: string[]) => Promise<string[]>
}

export interface IBaseOptions {
  dir: string
  retry?: number
  existCheck: boolean
  ignoreError?: boolean
  gzip?: boolean
  provider: IProvider
  ignore?: string[]
}

export interface Options extends IBaseOptions {
  // define your plugin options here
}
