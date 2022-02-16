import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { unpluginUploadCDN, COS } from "unplugin-upload-cdn";

const cos = new COS({});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    unpluginUploadCDN.vite({
      dir: "dist",
      ignore: ["**/*.html"],
      provider: cos,
    }),
  ],
});
