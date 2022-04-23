const fs = require('fs');
const Path = require('path');

const paths = {
    build: {
        root: './build',
        assets: './build/assets'
    },
    src: {
        imageAssets: './src/assets/img',
        jsonAssets: './src/assets/json'
    }
};

const deleteFolderRecursive = function (directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
          const curPath = Path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
           // recurse
            deleteFolderRecursive(curPath);
          } else {
            // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(directoryPath);
      }
    };

deleteFolderRecursive(paths.build.root)

if (!fs.existsSync(paths.build.root)) {
    fs.mkdirSync(paths.build.root);
}

if (!fs.existsSync(paths.build.assets)) {
    const imageAssets = fs.readdirSync(paths.src.imageAssets);
    const jsonAssets = fs.readdirSync(paths.src.jsonAssets);

    fs.mkdirSync(paths.build.assets);

    for (const asset of imageAssets) {
        fs.copyFileSync(`${paths.src.imageAssets}/${asset}`, `${paths.build.assets}/${asset}`);
    }

    for (const asset of jsonAssets) {
        fs.copyFileSync(`${paths.src.jsonAssets}/${asset}`, `${paths.build.assets}/${asset}`);
    }
}

require('child_process').spawn('parcel', ['index.html', '--no-autoinstall', '--open', '--out-dir', 'build'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
});