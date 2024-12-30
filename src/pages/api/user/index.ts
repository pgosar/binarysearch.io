import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { zUserData } from 'src/pages/models/User';
import { buildHandler } from 'src/utils/build-handler';
import { errorHandler } from 'src/utils/error-handler';

async function postCallback(req: NextApiRequest, res: NextApiResponse) {
  const userData = zUserData.parse(req.body);
  const user = await global.database.USERS.create(userData);
  return res.status(StatusCodes.CREATED).json(user);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const f = buildHandler({ postCallback });
    await f(req, res);
  } catch (err) {
    return errorHandler(req, res, err);
  }
}
