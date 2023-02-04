import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// node polyfill 
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  resolve: {
    alias: {
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      // stream: 'readable-stream',
      // 'readable-stream': 'vite-compatible-readable-stream',
    },
  },
  optimizeDeps:{
    esbuildOptions:{
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        target : "http://193.203.215.185:8080/",
        changeOrigin : true,
        /**重写路径**/
        rewrite: (path)=> path.replace(/^\/api/,'')
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin used during production bundling
        // builtins() as any,
        rollupNodePolyFill() as any,
      ]
    }
  },
});
