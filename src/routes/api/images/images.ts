import express, { NextFunction, Request, Response } from 'express';
import sharp, { Sharp } from 'sharp';
import fs from 'fs';
import path from 'path';

const images = express.Router();

const rootDir = path.resolve(process.cwd());
const fullFolderPath = '/src/assets/full';
const thumbFolderPath = '/src/assets/thumb';

/**
 * Function used to check the folder existence of given path
 * @param {string} folderPath path of the folder
 * @return {boolean} returns true value if exists or creates a new folder and returns true
 */
const checkFolderExistence = (folderPath: string, res: Response): void | boolean => {
  try {
    if (fs.existsSync(rootDir + folderPath)) {
      return true;
    } else {
      fs.mkdirSync(rootDir + folderPath);
      return true;
    }
  } catch (e) {
    res.status(400).send('Error occurred while accessing folder!');
    return;
  }
};

/**
 * Function that returns a file name with extension
 * @param {string} filename filename without extension
 * @return {string} filename with extension
 */
const imageWithExtension = (filename: string, res: Response): string | void => {
  if (checkFolderExistence(fullFolderPath, res)) {
    const files = fs.readdirSync(rootDir + fullFolderPath);
    return files.filter((file) => filename === file.split('.')[0])[0];
  }
};

/**
 * Function used to scale the given image with respective of their extension
 * @param {string} extension extension of the file
 * @param {string} originalImagePath path of the unscaled or original image
 * @param {number | null} width width of the image
 * @param {string} height height of the image
 * @param {string} optimizedImagePath path of the scaled image
 * @param {Response} res response object of express
 * @param {NextFunction} next next object of express
 * @return {Promise<Sharp | void>} returns a promise of scaled image
 */
const resizeWithSharp = async (
  extension: string,
  originalImagePath: string,
  width: number | null,
  height: number | null,
  optimizedImagePath: string,
  res: Response,
  next: NextFunction,
): Promise<Sharp | void> => {
  try {
    switch (extension) {
      case 'jpeg':
        await sharp(originalImagePath).resize(width, height).jpeg({ quality: 60 }).toFile(optimizedImagePath);
        sendImage(optimizedImagePath, res, next);
        break;
      case 'png':
        await sharp(originalImagePath).resize(width, height).png({ quality: 60 }).toFile(optimizedImagePath);
        sendImage(optimizedImagePath, res, next);
        break;
      case 'webp':
        await sharp(originalImagePath).resize(width, height).webp({ quality: 60 }).toFile(optimizedImagePath);
        sendImage(optimizedImagePath, res, next);
        break;
      default:
        res.status(400).send('Images with .jpg, .png and .webp are only supported!');
        break;
    }
  } catch (error) {
    res.status(400).send('Error while resizing Image');
    return;
  }
};

/**
 * Function that used to send scaled images to client
 * @param {string} filePath path of the scaled image
 * @param {Response} res response object of express
 * @param {NextFunction} next next object of express
 * @return {void} returns void
 */
const sendImage = (filePath: string, res: Response, next: NextFunction): void => {
  res.sendFile(filePath, function (err) {
    if (err) {
      next(err);
      res.status(400).send('Error occurred when sending file to client');
      return;
    } else {
      next();
    }
  });
};

/**
 * Function that helps to scale the image with the given query params
 * @param {string} filename filename without extension
 * @param {number} width width of the image
 * @param {number} height height of the image
 * @param {Response} res response object of express
 * @param {NextFunction} next next object of express
 * @return {void} returns void
 */
const imageProcessor = (
  filename: string,
  width: number | null,
  height: number | null,
  res: Response,
  next: NextFunction,
): void => {
  const imageWithExt = imageWithExtension(filename, res);

  // fetches original image file path
  const originalImagePath = checkFolderExistence(fullFolderPath, res)
    ? rootDir + fullFolderPath + `/${imageWithExt}`
    : '';

  // fetches scaled image file path if exists
  const optimizedImagePath = checkFolderExistence(thumbFolderPath, res)
    ? rootDir + thumbFolderPath + `/${imageWithExt}`
    : '';

  switch (typeof imageWithExt === 'string' && path.extname(imageWithExt)) {
    case '.jpg':
      resizeWithSharp('jpeg', originalImagePath, width, height, optimizedImagePath, res, next);
      break;
    case '.png':
      resizeWithSharp('png', originalImagePath, width, height, optimizedImagePath, res, next);
      break;
    case '.webp':
      resizeWithSharp('webp', originalImagePath, width, height, optimizedImagePath, res, next);
      break;
    default:
      res.status(400).send(`The specified image "${filename}" is not found!`).end();
      return;
  }
};

/**
 * Function that combines whole logic of scaling image
 * @param {string} filename filename without extension
 * @param {number} parsedWidth width of the image
 * @param {number} parsedHeight height of the image
 * @param {Response} res response object of express
 * @param {NextFunction} next next object of express
 * @return {void} return void
 */
const mainResize = (
  filename: string,
  parsedWidth: number | null,
  parsedHeight: number | null,
  res: Response,
  next: NextFunction,
): void => {
  imageWithExtension(filename, res);
  imageProcessor(filename, parsedWidth, parsedHeight, res, next);
};

images.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { filename, width, height } = req.query;
  let parsedWidth = 0;
  let parsedHeight = 0;

  // Used to parse query params from url
  if (!filename) {
    res.status(400).send('Please pass the required query params!').end();
    return;
  } else if (filename && !width && !height) {
    res.status(400).send('Please pass width or height params!').end();
    return;
  } else if (width && height) {
    parsedWidth = parseInt(width as string);
    parsedHeight = parseInt(height as string);
  } else if (width) {
    parsedWidth = parseInt(width as string);
    parsedHeight = -1;
  } else if (height) {
    parsedHeight = parseInt(height as string);
    parsedWidth = -1;
  }

  //Used to check query params condition and pass correct query params to the mainResize() func
  if (parsedWidth > 0 && parsedHeight > 0) {
    mainResize(filename as string, parsedWidth, parsedHeight, res, next);
  } else if (parsedWidth > 0 && parsedHeight === -1) {
    mainResize(filename as string, parsedWidth, null, res, next);
  } else if (parsedHeight > 0 && parsedWidth === -1) {
    mainResize(filename as string, null, parsedHeight, res, next);
  } else {
    res.status(400).send('Enter valid values of width or height!').end();
    return;
  }
});

export { images, mainResize, checkFolderExistence, imageWithExtension, imageProcessor, resizeWithSharp, sendImage };
