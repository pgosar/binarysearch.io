import type { NextApiRequest, NextApiResponse } from 'next';

import {StatusCodes} from "http-status-codes";
import {buildHandler} from "../../../utils/build-handler";
import {errorHandler} from "../../../utils/error-handler";
import {zUserId} from "../../models/User";

// Handler for getting user profile
async function getProfile(req: NextApiRequest, res: NextApiResponse) {
  const userId = zUserId.parse(req.query);
  const profile = await global.database.USERS.findOne(userId)

  if (!profile){
    return res.status(StatusCodes.NOT_FOUND).json({message: "Profile not found"})
  }

  return res.status(StatusCodes.OK).json(profile);
}


export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try {
    const f = buildHandler({GET: getProfile });
    await f(req, res)

  }catch (err){
    return errorHandler(req, res, err)
  }
}
