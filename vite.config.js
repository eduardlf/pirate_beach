import path from 'path'

export default {
    // OPCIONAL: prefixo da rota
    //base: '/src',
    root: path.resolve(__dirname, 'src'),
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        },
    },
    
    // OPCIONAL: configurações de build
    build: {
        // OPCIONAL: diretório de saída do build
        // padrão: 'dist'
        outDir: '../dist',
    },
    
    server: {
        // OPCIONAL: porta do servidor de desenvolvimento
        port: 3000,
    },
    
    preview: {
        // OPCIONAL: porta do servidor de preview
        port: 8080,
    }
}