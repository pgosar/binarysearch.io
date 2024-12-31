import type { NextApiRequest, NextApiResponse } from 'next';
import {buildHandler} from "../../../utils/build-handler";
import {errorHandler} from "../../../utils/error-handler";
import {StatusCodes} from "http-status-codes";
import {zRoomData} from "../../models/Room";

// Handler for creating a room
async function postRoom(req: NextApiRequest, res: NextApiResponse) {
  const parsedData = zRoomData.parse(req.body);
  const room = await global.database.ROOMS.create(parsedData);
  return res.status(StatusCodes.CREATED).json(room);
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const f =  buildHandler({POST: postRoom });
    await f(req, res);
  } catch (err) {
    return errorHandler(req, res, err);
  }
}
