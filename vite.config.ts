import pkg from "./package.json";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";
import vueDevTools from "vite-plugin-vue-devtools";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_NAME__: JSON.stringify(pkg.appName)
  },
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    tsconfigPaths(),
    Icons({
      compiler: "vue3",
      autoInstall: true
    }),
    electron({
      main: {
        entry: "electron/main.ts",
        vite: {
          build: {
            outDir: "build/compiled/electron"
          },
          resolve: {
            alias: {
              "@shared": fileURLToPath(new URL("./shared", import.meta.url))
            }
          }
        }
      },
      preload: {
        input: path.join(__dirname, "electron/preload.ts"),
        vite: {
          build: {
            outDir: "build/compiled/electron"
          },
          resolve: {
            alias: {
              "@shared": fileURLToPath(new URL("./shared", import.meta.url))
            }
          }
        }
      },
      renderer: process.env.NODE_ENV === "test" ? undefined : {}
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url))
    }
  },
  build: {
    outDir: "build/compiled/renderer",
    chunkSizeWarningLimit: 2500
  },
  server: {
    watch: {
      ignored: ["**/build/compiled/**", "**/release/**", "**/node_modules/**"]
    }
  }
});
