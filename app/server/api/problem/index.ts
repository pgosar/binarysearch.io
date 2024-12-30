import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { createProblemInDb } from '../../../services/problemService'; // Assumes this is in your service layer for actual DB interaction
import { authenticateJWT } from '../../../utils/auth';
import { ProblemSchema } from '../../models/Problem';

// Handler for creating a new problem
async function createProblem(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the request body using the existing ProblemSchema
    const parsedData = ProblemSchema.omit({ problemId: true }).parse(req.body); // Omit problemId as it's typically auto-generated in DB

    const { name, description, difficultyTag, publicTestCases, privateTestCases } = parsedData;
    const newProblem = await createProblemInDb({ name, description, difficultyTag, publicTestCases, privateTestCases });

    res.status(201).json({ message: 'Problem created', data: newProblem });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    console.error('Error creating problem:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    switch (req.method) {
      case 'POST':
        return await createProblem(req, res);

      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
