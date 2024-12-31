import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { zUserData } from 'src/pages/models/User';
import { buildHandler } from 'src/utils/build-handler';
import { errorHandler } from 'src/utils/error-handler';

async function postUser(req: NextApiRequest, res: NextApiResponse) {
  const userData = zUserData.parse(req.body);
  const user = await global.database.USERS.create(userData);
  return res.status(StatusCodes.CREATED).json(user);
}

async function getAllUsers(_: NextApiRequest, res: NextApiResponse) {
  const users = await global.database.USERS.find();
  return res.status(StatusCodes.OK).json(users);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const f = buildHandler({ GET: getAllUsers, POST: postUser });
    await f(req, res);
  } catch (err) {
    return errorHandler(req, res, err);
  }
}
