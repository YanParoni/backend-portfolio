import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    username: string;
    email: string;
    profileImage: string;
    oauth: boolean;
  };
}
