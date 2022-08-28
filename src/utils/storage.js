import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// get dirname of the current file
const __dirname = dirname(fileURLToPath(import.meta.url));
// get path to assets folder in root of project
const StoragePath = path.join(__dirname, '../../assets');

class Asset {
  /**
   * 
   * @param {string} name 
   * @param {string} path 
   * @param {Buffer} content 
   */
  constructor(name, path, content) {
    this.name = name;
    this.path = path;
    this.content = content;
    this.url = undefined;
  }

  setUrl(url) {
    this.url = url;
  }
}

export default {
  /**
   *
   * @param {Express.Multer.File} file
   * @returns {Asset} - file name
   */
  saveFile(file) {
    let filename = file.originalname;
  
    // check if a file with the same name already exists in the storage folder
    if (fs.existsSync(`${StoragePath}/${filename}`)) {
      // if so, generate a new name
      filename = `${filename.split('.')[0]}_${Date.now()}.${filename.split('.')[1]}`;
    }
  
    // get the absolute path for storage folder
    const absolutePath = `${StoragePath}/${filename}`;
    
    // save the file with the new name
    fs.writeFileSync(absolutePath, file.buffer);
    
    // return asset
    return new Asset(filename, absolutePath, file.buffer);
  },
  
  /**
   * 
   * @param {Express.Multer.File[]} files 
   * @returns {Asset[]} - assets
   */
  saveMultipleFiles(files, tag = undefined) {
    if(tag){
      // check if name space is valid as a file name
      if (!tag.match(/^[a-zA-Z0-9_\-]+$/)) {
        throw new Error('Invalid namespace');
      }
  
      // remove outer spaces from tag
      tag = tag.trim();
  
      // remove invalid file name characters from tag
      tag = tag.replace(/[^a-zA-Z0-9_\-]/g, '');
    }

    return files.map(file => {
      // append tage to original name if provided
      file.originalname = tag ? `${tag}_${file.originalname}` : file.originalname;
      // store file in assets folder
      return this.saveFile(file);
    })
  },
  
  /**
   * 
   * @param {string} filename 
   * @returns {Asset} file content
   */
  getFile(filename) {
    const absolutePath = `${StoragePath}/${filename}`;
    return new Asset(filename, absolutePath, fs.readFileSync(absolutePath));
  },
  
  /**
   * 
   * @param {string} filename 
   * @returns {boolean} deleted
   */
  removeFile(filename){
    try {
      fs.unlinkSync(`${StoragePath}/${filename}`);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * 
   * @param {string} tag 
   * @returns {Asset[]} - files
   */
  getFilesByTag(tag) {
    // find all files in storage folder that match 'tag_' prefix
    const files = fs.readdirSync(StoragePath).filter(file => file.startsWith(`${tag}_`));
    // return assets
    return files.map(file => this.getFile(file));
  },

  /**
   * 
   * @param {string} tag 
   * @returns {boolean} - deleted
   */
  removeFilesByTag(tag) {
    // get files matching tag
    const files = this.getFilesByTag(tag);
    // remove files
    return files.map(file => this.removeFile(file.name));
  }
}