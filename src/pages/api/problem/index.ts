import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buildHandler } from 'src/utils/build-handler';
import { errorHandler } from 'src/utils/error-handler';

import { zProblemData } from '../../../models/Problem';

// Return all problems
async function getCallback(_: NextApiRequest, res: NextApiResponse) {
  const problem = await global.database.PROBLEMS.find();
  return res.status(StatusCodes.OK).json(problem);
}

// Create a problem
async function postProblem(req: NextApiRequest, res: NextApiResponse) {
  const parsedData = zProblemData.parse(req.body);
  const problem = await global.database.PROBLEMS.create(parsedData);
  return res.status(StatusCodes.CREATED).json(problem);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const f = buildHandler({ GET: getCallback, POST: postProblem });
    await f(req, res);
  } catch (err) {
    return errorHandler(req, res, err);
  }
}
