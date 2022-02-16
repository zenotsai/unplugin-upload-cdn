# unplugin-upload-cdn

[![NPM version](https://img.shields.io/npm/v/unplugin-starter?color=a1b858&label=)](https://github.com/zenotsai/unplugin-upload-cdn)

Upload resource files to cdn. Powered by unplugin.

# Install
```bash
npm i unplugin-upload-cdn
```


# Provider
Support Tencent cos, Alibaba oss

[COS Document](https://cloud.tencent.com/document/product/436/8629)
[OSS Document](https://help.aliyun.com/document_detail/111256.html)
```js
import { unpluginUploadCDN, COS, OSS } from "unplugin-upload-cdn";

const cos = new COS({ /* options */ });
const oss = new OSS({ /* options */ });

import { unpluginUploadCDN, COS } from "unplugin-upload-cdn";

export default defineConfig({
  plugins: [
    unpluginUploadCDN.vite({
     /* options */
     provider: cos // oss,
    }),
  ],
})
```
The parameters of the environment variables are read by default

OSS
```js
{
  accessKeyId: process.env.CDN_PLUGIN_ACCESSKEY_ID,
  accessKeySecret: process.env.CDN_PLUGIN_SECRET,
  bucket: process.env.CDN_PLUGIN_BUCKET,
  region: process.env.CDN_PLUGIN_REGION,
}
```

COS
```js
{
  SecretId: process.env.CDN_PLUGIN_SECRET_ID,
  SecretKey: process.env.CDN_PLUGIN_SECRET_KEY,
  Bucket: process.env.CDN_PLUGIN_BUCKET,
  Region: process.env.CDN_PLUGIN_REGION,
}
```

## Custom
implements IProvider 
```ts
export interface IProvider {
  upload: (file: IFile) => void
  beforeUpload: (files: IResource[], existCheck?: boolean) => Promise<IResource[]>
}
```


Name | Environment Variables | Default | Description |
---  | --- | --- | --- |
ignore | `CDN_PLUGIN_IGNORE` | [] | ignore uploaded files, e.g. ["**/*.html"] |
dir |  | null | Uploaded directory |
existCheck | `CDN_PLUGIN_EXISTCHECK` | null | check if the file has been uploaded, judged by the file name |
prefix | null | package.json.name | prefix |
useVersion | `CDN_PLUGIN_USE_VERSION` | false | splice the version of package.json as a prefix |
provider | - | null | - |


# Options


<br></details>

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import { unpluginUploadCDN, COS } from "unplugin-upload-cdn";

export default defineConfig({
  plugins: [
    unpluginUploadCDN.vite({
     /* options */
    }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import { unpluginUploadCDN, COS } from "unplugin-upload-cdn";

export default {
  plugins: [
     unpluginUploadCDN.rollup({
      /* options */
    }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts

const { unpluginUploadCDN, COS } = require("unplugin-upload-cdn");

// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    unpluginUploadCDN.webpack({
      /* options */
    }),
  ]
}
```

<br></details>


