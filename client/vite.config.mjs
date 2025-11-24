/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint2';

// ----------------------------------------------------------------------
export default defineConfig(({ command, mode }) => {
  console.log(`You are running vite with command ${command} in ${mode} mode!`);
  if (command === 'serve') {
    return {
      plugins: [
        react(),
        eslint({
          dev: true,
          build: false,
          eslintPath: 'eslint/use-at-your-own-risk',
        }),
      ],
      resolve: {
        alias: [
          {
            find: /^~(.+)/,
            replacement: path.join(process.cwd(), 'node_modules/$1'),
          },
          {
            find: /^src(.+)/,
            replacement: path.join(process.cwd(), 'src/$1'),
          },
        ],
      },
      server: {
        port: 3030,
        // hmr: true,
        hmr: { overlay: true },
      },
      preview: {
        port: 3030,
      },
      build: {
        sourcemap: true,
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                return id.toString().split('node_modules/')[1].split('/')[0].toString();
              }
              return '';
            },
          },
        },
      },
    };
  } else {
    // command === 'build'
    return {
      plugins: [
        react(),
        eslint({
          dev: true,
          build: false,
          eslintPath: 'eslint/use-at-your-own-risk',
        }),
      ],
      resolve: {
        alias: [
          {
            find: /^~(.+)/,
            replacement: path.join(process.cwd(), 'node_modules/$1'),
          },
          {
            find: /^src(.+)/,
            replacement: path.join(process.cwd(), 'src/$1'),
          },
        ],
      },
      build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                return id.toString().split('node_modules/')[1].split('/')[0].toString();
              }
              return '';
            },
          },
        },
      },
    };
  }
});
