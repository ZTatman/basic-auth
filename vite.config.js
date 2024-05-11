import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import devServer from '@hono/vite-dev-server';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000, // change to a custom port
    },
    plugins: [
        react(),
        devServer({
            entry: 'server.js',
            exclude: [
                // We need to override this option since the default setting doesn't fit
                /.*\.jsx?($|\?)/,
                /.*\.(s?css|less)($|\?)/,
                /.*\.(svg|png)($|\?)/,
                /^\/@.+$/,
                /^\/favicon\.ico$/,
                /^\/(public|assets|static)\/.+/,
                /^\/node_modules\/.*/,
            ],
            injectClientScript: false, // This option is buggy, disable it and inject the code manually
        }),
    ],
});
