import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buildHandler } from 'src/utils/build-handler';
import { errorHandler } from 'src/utils/error-handler';

import { zProblemData, zProblemId } from '../../models/Problem';

async function getProblem(req: NextApiRequest, res: NextApiResponse) {
  const problemId = zProblemId.parse(req.query);
  const problem = await global.database.PROBLEMS.findOne(problemId);
  return res.status(StatusCodes.OK).json(problem);
}

async function patchProblem(req: NextApiRequest, res: NextApiResponse) {
  const problemId = zProblemId.parse(req.query);
  const parsedData = zProblemData.partial().parse(req.body);
  const updatedProblem = await global.database.PROBLEMS.findOneAndUpdate(problemId, parsedData, { upsert: false });
  return res.status(StatusCodes.OK).json(updatedProblem);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const f = buildHandler({ GET: getProblem, PATCH: patchProblem });
    await f(req, res);
  } catch (err) {
    return errorHandler(req, res, err);
  }
}
