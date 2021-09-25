import express, { NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

const images = express.Router();

const originalImagePath = 'src/assets/full';

/**
 * Function that returns an array of file names with extensions
 * @param {string} filename filename without extension
 * @return {string[]} filenames with different extensions
 */
const imagesWithExtensions = (filename: string): string[] => {
  const files = fs.readdirSync(originalImagePath);
  return files.filter((file) => filename.includes(file.split('.')[0]));
};

/**
 * Function that helps to scale the image with the given query params
 * @param {string} filename filename with extension
 * @param {number} width width of the image
 * @param {number} height height of the image
 * @return {Promise<Promise<string>[]>} returns a Promise that includes an array of
 * image promises with different extension
 */
const imageProcessor = async (
  filename: string,
  width: number | null,
  height: number | null,
): Promise<Promise<string>[]> => {
  try {
    const imagesWithExts = imagesWithExtensions(filename);
    const optimizedImagesWithPaths = imagesWithExts.map(async (file): Promise<string> => {
      try {
        const originalImagePath = __dirname.split('/routes')[0] + `/assets/full/${file}`;
        const optimizedImagePath = __dirname.split('/routes')[0] + `/assets/thumb/${file}`;
        switch (path.extname(file)) {
          case '.jpg':
            try {
              await sharp(originalImagePath).resize(width, height).jpeg({ quality: 60 }).toFile(optimizedImagePath);
            } catch (error) {
              throw new Error(`Error while resizing image ${file}!`);
            }
            break;
          case '.png':
            try {
              await sharp(originalImagePath).resize(width, height).png({ quality: 50 }).toFile(optimizedImagePath);
            } catch (error) {
              throw new Error(`Error while resizing image ${file}!`);
            }
            break;
          case '.webp':
            try {
              await sharp(originalImagePath).resize(width, height).webp({ quality: 50 }).toFile(optimizedImagePath);
            } catch (error) {
              throw new Error(`Error while resizing image ${file}!`);
            }
            break;
          default:
            break;
        }
        return `/assets/thumb/${file}`;
      } catch (error) {
        return new Promise((resolve, reject) => reject(new Error('something bad happened')));
      }
    });
    return optimizedImagesWithPaths;
  } catch (error) {
    return new Promise((resolve, reject) => reject(new Error('something bad happened')));
  }
};

/**
 * Function that used to send scaled images to client
 * @param {string} imageProcessor a Promise of image promises
 * @param {Object} res response object of express
 * @param {Object} next next object of express
 * @return {void} returns void
 */
const sendImage = (imageProcessor: Promise<Promise<string>[]>, res: Response, next: NextFunction): void => {
  imageProcessor.then(
    (data) => {
      if (data.length > 0) {
        data[0].then(
          (image) => {
            const options = {
              root: path.join(__dirname.split('/routes')[0]),
            };
            res.sendFile(image as string, options, function (err) {
              if (err) {
                next(err);
              } else {
                next();
              }
            });
          },
          (err) => {
            throw new Error(err);
          },
        );
      } else {
        res.send('Please pass valid query parameters');
      }
    },
    (err) => {
      throw new Error(err);
    },
  );
};

images.get('/', (req: Request, res: Response, next: NextFunction) => {
  if (req.query.filename && (req.query.width || req.query.height)) {
    const { filename, width, height } = req.query;
    if (width && height) {
      const parsedWidth = parseInt(width as string);
      const parsedHeight = parseInt(height as string);
      if (parsedWidth > 0 && parsedHeight > 0) {
        const processedImages = imageProcessor(filename as string, parsedWidth, parsedHeight);
        sendImage(processedImages, res, next);
      } else {
        res.send('Enter valid values of width or height!');
      }
    } else if (width) {
      const parsedWidth = parseInt(width as string);
      if (parsedWidth > 0) {
        const processedImages = imageProcessor(filename as string, parsedWidth, null);
        sendImage(processedImages, res, next);
      } else {
        res.send('Enter valid values of width or height!');
      }
    } else if (height) {
      const parsedHeight = parseInt(height as string);
      if (parsedHeight > 0) {
        const processedImages = imageProcessor(filename as string, null, parsedHeight);
        sendImage(processedImages, res, next);
      } else {
        res.send('Enter valid values of width or height!');
      }
    }
  } else {
    res.send('Please pass valid query parameters');
  }
});

export { images, imagesWithExtensions, imageProcessor, sendImage };
