export default {
  build: {
    rollupOptions: {
      input: ['./index.js'],
      preserveEntrySignatures: 'allow-extension',
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      },
    },
  },
}
