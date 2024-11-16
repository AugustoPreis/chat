const fs = require('fs');
const { execSync } = require('child_process');

function validateVersion(version) {
  if (typeof version !== 'string') {
    console.error('A versão deve ser uma string no seguinte formato: "x.x.x"');

    process.exit(1);
  }

  const [major, minor, patch] = version.split('.');

  if (!major || !minor || !patch) {
    console.error('A versão deve ser uma string no seguinte formato: "x.x.x"');

    process.exit(1);
  }
}

function readPkg(dir) {
  if (!fs.existsSync(`./${dir}/package.json`)) {
    console.error(`Arquivo "./${dir}/package.json" não encontrado`);

    process.exit(1);
  }

  const strPackage = fs.readFileSync(`./${dir}/package.json`, 'utf8');

  return JSON.parse(strPackage);
}

function writePkg(dir, pkg) {
  const formattedPkg = JSON.stringify(pkg, null, 2);

  fs.writeFileSync(`./${dir}/package.json`, formattedPkg);
}

function generateBuild(dir) {
  console.log('Gerando build do', dir);

  execSync(`cd ${dir} && npm run build`);
}

function copyFiles(from, to, files) {
  if (!Array.isArray(files)) {
    return;
  }

  files.forEach((file) => {
    fs.copyFileSync(`./${from}/${file}`, `./${to}/${file}`);
  });
}

const version = process.argv[2];
const packageBackend = readPkg('backend');
const packageFrontend = readPkg('frontend');

validateVersion(version);

packageBackend.version = version;
packageFrontend.version = version;

writePkg('backend', packageBackend);
writePkg('frontend', packageFrontend);

generateBuild('backend');
generateBuild('frontend');

copyFiles(
  './backend',
  './backend/build',
  ['.env'],
);