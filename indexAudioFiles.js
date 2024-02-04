import * as fs from 'fs';
import * as path from 'path';

const directoryPath = 'src/assets/audio'; // Replace with the actual path to your directory

const audioFiles = fs.readdirSync(directoryPath).filter(file => /\.(mp3)$/i.test(file));

const importStatements = audioFiles.map(file => {
  const fileNameWithoutExtension = path.parse(file).name;
  return `import ${fileNameWithoutExtension} from './${file}';`;
}).join('\n');

const exportStatements = audioFiles.map(file => {
  const fileNameWithoutExtension = path.parse(file).name;
  return `${fileNameWithoutExtension},`;
}).join('\n');

const content = `${importStatements}

export default {
  ${exportStatements}
};
`;

fs.writeFileSync(path.join(directoryPath, 'audioFiles.ts'), content);

console.log('audioFiles.ts generated successfully.');
