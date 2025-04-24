import 'express-session';
import type { User } from '../types/types';


declare module 'express-session' {
    interface SessionData {
      user?: User;
    }
  }
