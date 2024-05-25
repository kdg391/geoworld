import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        const module = id
                            .split('node_modules/')
                            .pop()
                            ?.split('/')[0]

                        return `vendor-${module}`
                    }
                },
            },
        },
    },
    base: '/geography-guessing/',
})
