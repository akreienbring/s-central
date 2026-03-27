import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------
export default defineConfig(({ command, mode }: { command: 'build' | 'serve'; mode: string }) => {
  console.log(`You are running vite with command ${command} in ${mode} mode!`);
  if (command === 'serve') {
    return {
      plugins: [
        react(),
        checker({
          typescript: true,
        }),
      ],
      resolve: {
        alias: [
          {
            find: /^@src(.+)/,
            replacement: path.resolve(process.cwd(), './src/$1'),
          },
        ],
      },
      server: {
        port: 3030,
        // hmr: true,
        hmr: { overlay: false },
      },
      preview: {
        port: 3030,
      },
      build: {
        sourcemap: true,
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
          output: {
            codeSplitting: true,
          },
        },
      },
    };
  } else {
    // command === 'build'
    return {
      plugins: [react()],
      resolve: {
        alias: [
          {
            find: /^@src(.+)/,
            replacement: path.resolve(process.cwd(), './src/$1'),
          },
        ],
      },
      build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
          output: {
            codeSplitting: {
              groups: [
                {
                  name: 'react-vendor',
                  test: /node_modules[\\/]react/,
                  priority: 20,
                },
                {
                  name: 'ui-vendor',
                  test: /node_modules[\\/]mui/,
                  priority: 15,
                },
                {
                  name: 'large-libs',
                  test: /node_modules/,
                  minSize: 100000, // 100KB
                  maxSize: 250000, // 250KB
                  priority: 10,
                },
              ],
            },
          },
        },
      },
    };
  }
});
