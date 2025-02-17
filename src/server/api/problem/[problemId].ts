import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT } from "../../../utils/auth";
import { getProblemById, getAllProblems, updateProblemById } from "../../../services/problemService";
import { ZodError } from 'zod';
import {ProblemSchema} from "../../models/Problem";

// Handler for getting a single problem by ID
async function getProblem(req: NextApiRequest, res: NextApiResponse) {
    const { problemId } = req.query;

    if (!problemId || Array.isArray(problemId)) {
        return res.status(400).json({ message: 'Invalid or missing problemId' });
    }

    try {
        const problem = await getProblemById(problemId);
        if (!problem) {
            return res.status(404).json({ message: `Problem with ID ${problemId} not found` });
        }
        res.status(200).json(problem);
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Handler for getting all problems
async function getAll(res: NextApiResponse) {
    try {
        const problems = await getAllProblems();
        if (!problems || problems.length === 0) {
            return res.status(404).json({ message: 'No problems found' });
        }
        res.status(200).json(problems);
    } catch (error) {
        console.error('Error fetching all problems:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Handler for patching a problem
async function patchProblem(req: NextApiRequest, res: NextApiResponse) {
    const { problemId } = req.query;

    if (!problemId || Array.isArray(problemId)) {
        return res.status(400).json({ message: 'Invalid or missing problemId' });
    }

    try {
        // Validate the request body using Zod
        const parsedData = ProblemSchema.parse(req.body); // Validate body using the Problem schema

        const updatedProblem = await updateProblemById(problemId, parsedData);
        if (!updatedProblem) {
            return res.status(404).json({ message: `Problem with ID ${problemId} not found` });
        }
        res.status(200).json(updatedProblem);
    } catch (error) {
        if (error instanceof ZodError) {
            // Handle Zod validation errors
            return res.status(400).json({ message: 'Invalid data', errors: error.errors });
        }
        console.error('Error updating problem:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await authenticateJWT(req, res);

        switch (req.method) {
            case 'GET':
                if (req.query.problemId) {
                    // If there is a problemId in the query, get a single problem
                    return await getProblem(req, res);
                } else {
                    // Otherwise, get all problems
                    return await getAll(res);
                }
            case 'PATCH':
                return await patchProblem(req, res);
            default:
                res.setHeader('Allow', ['GET', 'PATCH']);
                return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
