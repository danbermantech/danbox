import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

function packDirectory(dirName, options = {}) {
  const dirAssets = fs.readdirSync(path.join(__dirname, `./src/assets/${dirName}`));
  console.log(dirAssets);
  const dirPackList = {};
  dirAssets.forEach((asset) => {
    // console.log(asset);
    if(asset.indexOf('.') == -1) {
      const subAssets = fs.readdirSync(path.join(__dirname, `./src/assets/${dirName}`, asset));
      console.log(asset, subAssets);
      dirPackList[asset] = [];
      subAssets.forEach((subAsset) => {
        dirPackList[asset].push(subAsset);
      })
      // imagePackList.push(asset+'//'+subAssets);
    }
  })
  console.log(dirPackList);
  const output = fs.createWriteStream(path.join(__dirname, `./src/assets/${dirName}.ts`));
  // output.write('export const imageAssets = '+ JSON.stringify(imagePackList));
  Object.entries(dirPackList).forEach(([subDirName, assetList]) => {
    console.log(subDirName,assetList)
    assetList.forEach((asset) => {
      output.write('import '+asset.split('.')[0]+' from "./'+ dirName + '/' + subDirName + '/' + asset+'";\n');
    });
  })
  Object.entries(dirPackList).forEach(([subDirName, assetList]) => {
    console.log(subDirName,assetList)
    output.write('\n');
    output.write(`export const ${subDirName} = ${options.asArray ? '[' : '{'} \n`);
    assetList.forEach((asset) => {
      output.write('  ' + asset.split('.')[0]+',\n');
    });
    output.write(`${options.asArray ? ']' : '}'}\n`);
  })

  output.write('const index = {\n');
  Object.keys(dirPackList).forEach((subDirName) => {
    output.write('  '+subDirName+',\n');
  });
  output.write('}\n');
  output.write('export default index;\n');
  if(!options.asArray) {
    output.write ('export {\n');
    Object.values(dirPackList).forEach((subDir) => {
      subDir.forEach(asset=>{
        output.write('  '+asset.split('.')[0]+',\n');
      
      })
    });
    output.write('}\n');
  }
  output.end();

}

function packAssets() {

  console.log(__dirname);
  packDirectory('sounds', {asArray:true});
  packDirectory('images');
}

packAssets();