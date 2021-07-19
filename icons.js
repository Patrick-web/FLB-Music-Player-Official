import fs from 'fs';
import glob from 'glob';
// import JSON5 from 'json5';
import consola from 'consola';
import uniq from 'lodash/uniq';
import { pascalCase } from 'scule';

glob('./src/**/*.vue', {}, (err, files) => {
  const icons = files.map(mapper).filter(Boolean);
  console.log(uniq(icons).join(',\n'));
});
function mapper (file) {
  let result;
  try {
    const buffer = fs.readFileSync(file, 'utf8');
    const icon = buffer.match(/icon="([\w-]+)"/i);
    if (icon) {
      result = pascalCase(`ph-${icon[1]}`);
    }
  } catch (e) {
    consola.error(e);
  }
  return result;
}
