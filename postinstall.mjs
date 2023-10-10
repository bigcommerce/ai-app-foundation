import { pathExists, emptyDir, copy } from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const topDir = dirname(__filename);

/**
 * Copy TinyMCE files to public folder
 */
async function copyFiles() {
  const pathToFolder = join(topDir, 'public', 'tinymce');

  try {
    const exists = await pathExists(pathToFolder);

    if (!exists) {
      await emptyDir(pathToFolder);
      await copy(join(topDir, 'node_modules', 'tinymce'), pathToFolder, {
        overwrite: true,
      });
      console.log('TinyMCE files copied to public folder');
    }
  } catch (err) {
    console.error(err);
  }
}

await copyFiles();
