import { app } from '../../../../index';
import path from 'path';
import {
  imageWithExtension,
  sendImage,
  resizeWithSharp,
  checkFolderExistence,
} from '../../../../routes/api/images/images';
import supertest from 'supertest';
import { Request, Response, NextFunction } from 'express';

const request = supertest(app);

describe('Tests for /api/images', () => {
  describe('api/images endpoint response', () => {
    it('gets the api/images endpoint', async () => {
      const response = await request.get('/api/images');
      expect(response.status).toBe(400);
    });
    describe('Tests for /api/images query params', () => {
      describe('Failure api cases', () => {
        it('gets the /api/images?filename and should return 400 status', async () => {
          const response = await request.get('/api/images?filename');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename and should return a message', async () => {
          const response = await request.get('/api/images?filename');
          expect(response.text).toEqual('Please pass the required query params!');
        });
        it('gets the /api/images?filename=asdf and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=asdf');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=asdf and should return 200 status', async () => {
          const response = await request.get('/api/images?filename=asdf');
          expect(response.text).toEqual('Please pass width or height params!');
        });
        it('gets the /api/images?filename=asdf&width=0 and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=asdf&width=0');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=asdf&width=0 and should return a message', async () => {
          const response = await request.get('/api/images?filename=asdf&width=0');
          expect(response.text).toEqual('Enter valid values of width or height!');
        });
        it('gets the /api/images?filename=asdf&height=0 and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=asdf&height=0');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=asdf&height=0 and should return a message', async () => {
          const response = await request.get('/api/images?filename=asdf&height=0');
          expect(response.text).toEqual('Enter valid values of width or height!');
        });
        it('gets the /api/images?filename=asdf&height=0&width=0 and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=asdf&height=0&width=0');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=asdf&height=0&width=0 and should return a message', async () => {
          const response = await request.get('/api/images?filename=asdf&height=0&width=0');
          expect(response.text).toEqual('Enter valid values of width or height!');
        });
        it('gets the /api/images?filename=asdf&width=0&height=0 and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=asdf&width=0&height=0');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=asdf&width=0&height=0 and should return a message', async () => {
          const response = await request.get('/api/images?filename=asdf&width=0&height=0');
          expect(response.text).toEqual('Enter valid values of width or height!');
        });
        it('gets the /api/images?filename=fjord&width=0&height=0 and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=fjord&width=0&height=0');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=fjord&width=0&height=0 and should return a message', async () => {
          const response = await request.get('/api/images?filename=fjord&width=0&height=0');
          expect(response.text).toEqual('Enter valid values of width or height!');
        });
        it('gets the /api/images?filename=asdf&width=100&height=0 and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=asdf&width=100&height=0');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=asdf&width=100&height=0 and should return a message', async () => {
          const response = await request.get('/api/images?filename=asdf&width=100&height=0');
          expect(response.text).toEqual('Enter valid values of width or height!');
        });
        it('gets the /api/images?filename=asdf&width=0&height=100 and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=asdf&width=0&height=100');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=asdf&width=0&height=100 and should return a message', async () => {
          const response = await request.get('/api/images?filename=asdf&width=0&height=100');
          expect(response.text).toEqual('Enter valid values of width or height!');
        });
        it('gets the /api/images?filename=asdf&width=100&height=100 and should return 400 status', async () => {
          const response = await request.get('/api/images?filename=asdf&width=100&height=100');
          expect(response.statusCode).toEqual(400);
        });
        it('gets the /api/images?filename=asdf&width=100&height=100 and should return a message', async () => {
          const response = await request.get('/api/images?filename=asdf&width=100&height=100');
          expect(response.text).toEqual('The specified image "asdf" is not found!');
        });
      });
      describe('Success api cases', () => {
        it('gets the /api/images?filename=fjord&width=100&height=100 and should return 200 status', async () => {
          const response = await request.get('/api/images?filename=fjord&width=100&height=100');
          expect(response.statusCode).toEqual(200);
        });
        it('gets the /api/images?filename=fjord&height=300&width=100 and should return 200 status', async () => {
          const response = await request.get('/api/images?filename=fjord&height=300&width=100');
          expect(response.statusCode).toEqual(200);
        });
        it('gets the /api/images?filename=fjord&width=100 and should return 200 status', async () => {
          const response = await request.get('/api/images?filename=fjord&width=100');
          expect(response.statusCode).toEqual(200);
        });
        it('gets the /api/images?filename=fjord&height=300 and should return 200 status', async () => {
          const response = await request.get('/api/images?filename=fjord&height=300');
          expect(response.statusCode).toEqual(200);
        });
      });
    });
    describe('------ function tests ------', () => {
      const expResponse = app.response;
      it('imageWithExtension() expects to return undefined', () => {
        expect(imageWithExtension('something', expResponse)).toBeUndefined;
      });
      it('imageWithExtension() expects to return a filename with extension', () => {
        expect(imageWithExtension('fjord', expResponse)).toEqual('fjord.jpg');
      });
    });
  });
});
