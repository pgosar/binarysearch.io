import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';

export function errorHandler(req: NextApiRequest, res: NextApiResponse, error: unknown) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Invalid data', errors: error.errors });
  }

  console.error('Error updating problem:', req.url, req.method, error);
  return res.status(500).json({ message: 'Internal server error' });
}
