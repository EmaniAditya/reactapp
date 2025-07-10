import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 50645,
        // Only use HTTPS if explicitly requested
        https: process.env.USE_HTTPS === 'true',
        host: true, // Allow external connections
        // Support both HTTP and HTTPS
        open: process.env.USE_HTTPS === 'true' ? 'https://localhost:50645' : 'http://localhost:50645'
    }
})