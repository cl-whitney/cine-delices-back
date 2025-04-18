import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      accessToken?: string;
      user?: { id: number; email: string };
    }
  }
}