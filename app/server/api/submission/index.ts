import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { submitProblemToDb } from '../../../services/problemService';
import { authenticateJWT } from '../../../utils/auth';
import { ProblemSchema } from '../../models/Problem';

// Handler for submitting a problem
async function submitProblem(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the request body using ProblemSchema
    const submissionData = ProblemSchema.pick({ problemId: true, description: true }).parse(req.body);

    const submissionResult = await submitProblemToDb(submissionData);

    if (!submissionResult) {
      return res.status(400).json({ message: 'Problem submission failed' });
    }

    res.status(202).json({ message: 'Submission accepted', data: submissionResult });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }

    console.error('Error submitting problem:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    switch (req.method) {
      case 'POST':
        return await submitProblem(req, res);

      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
