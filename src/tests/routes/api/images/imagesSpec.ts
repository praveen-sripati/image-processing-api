import { app } from '../../../../index';
import { imagesWithExtensions, imageProcessor, sendImage } from '../../../../routes/api/images/images';
import supertest from 'supertest';
import { NextFunction } from 'express-serve-static-core';

const request = supertest(app);

describe('Tests for /api/images', () => {
  describe('api/images endpoint response', () => {
    it('gets the api/images endpoint', async () => {
      const response = await request.get('/api/images');
      expect(response.status).toBe(200);
    });
    describe('Tests for /api/images query params', () => {
      it('gets the /api/images?filename and should return a not valid query message', async () => {
        const response = await request.get('/api/images?filename=asdf');
        expect(response.text).toEqual('Please pass valid query parameters');
      });
      it('gets the /api/images?filename and should return 200 status', async () => {
        const response = await request.get('/api/images?filename=encenadaport');
        expect(response.statusCode).toEqual(200);
      });
      describe('------ imagesWithExtensions() function tests ------', () => {
        it('expects to return undefined', () => {
          expect(imagesWithExtensions('something')).toBeUndefined;
        });
        it('expects to return array of files with different extension', () => {
          expect(imagesWithExtensions('encenadaport')).toEqual(['encenadaport.jpg', 'encenadaport.png']);
        });
      });
      describe('------ ImageProcessor() function tests ------', () => {
        it('expects Promise to be resolved with all arguments set', async () => {
          await expectAsync(imageProcessor('fjord', 200, 300)).toBeResolved();
        });
        it('expects Promise to be resolved with height as null', async () => {
          await expectAsync(imageProcessor('fasdf', 200, null)).toBeResolved();
        });
        it('expects Promise to be resolved with width as null', async () => {
          await expectAsync(imageProcessor('fasdf', null, 200)).toBeResolved();
        });
        it('expects Promise to be rejected', async () => {
          await expectAsync(imageProcessor('fasdf', null, null)).toBeRejected;
        });
      });
      describe('------ sendImage() function tests ------', () => {
        it('expects to be resolved', async () => {
          const imageProcessorResponse = imageProcessor('fjord', 200, 100);
          const expResponse = app.response;
          const nextFunc = app.request.next;
          await expectAsync(sendImage(imageProcessorResponse, expResponse, nextFunc as NextFunction)).toBeResolved;
        });
      });
    });
  });
});
