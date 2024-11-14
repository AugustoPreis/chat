const esbuild = require('esbuild');

esbuild.build({
  // Arquivo de entrada
  entryPoints: [
    './src/**/**.js',
  ],

  // Empacotar dependências
  bundle: true,

  // Minificar o código
  // minify: true,

  // Definir ambiente como node
  platform: 'node',

  // Versão do node
  target: 'node20',

  // Arquivo de saída
  outdir: './build'
}).catch(() => process.exit(1));