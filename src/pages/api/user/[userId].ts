import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { buildHandler } from 'src/utils/build-handler';
import { errorHandler } from 'src/utils/error-handler';

import { zUserData, zUserId } from '../../models/User';

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const userId = zUserId.parse(req.query);
  const user = await global.database.USERS.findOne({ userId });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not Found' });
  }
  return res.status(StatusCodes.OK).json(user);
}

async function patchUser(req: NextApiRequest, res: NextApiResponse) {
  const userId = zUserId.parse(req.query);
  const updateFields = zUserData.partial().parse(req.body);
  const updatedUser = await global.database.USERS.findOneAndUpdate(userId, updateFields, { new: true });
  return res.status(StatusCodes.OK).json(updatedUser);
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const userId = zUserId.parse(req.query);
  await global.database.USERS.deleteOne({ userId });
  return res.status(StatusCodes.NO_CONTENT);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const f = buildHandler({ GET: getUser, PATCH: patchUser, DELETE: deleteUser });
    await f(req, res);
  } catch (err) {
    return errorHandler(req, res, err);
  }
}
