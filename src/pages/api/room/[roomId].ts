import type { NextApiRequest, NextApiResponse } from 'next';
import {zRoomData, zRoomId} from "../../models/Room";
import {StatusCodes} from "http-status-codes";
import {buildHandler} from "../../../utils/build-handler";
import {errorHandler} from "../../../utils/error-handler";

// Handler for getting room details
async function getRoom(req: NextApiRequest, res: NextApiResponse){
  const roomId = zRoomId.parse(req.query)
  const room = await global.database.ROOMS.findOne(roomId);

  if (!room){
    return res.status(StatusCodes.NOT_FOUND).json({message: "Room not found"})
  }

  return res.status(StatusCodes.OK).json(room)
}
// Handler for updating room details
async function patchRoom(req: NextApiRequest, res: NextApiResponse){
  const roomId = zRoomId.parse(req.query)
  const updateFields = zRoomData.partial().parse(req.body);
  const updatedRoom = await global.database.ROOMS.findOneAndUpdate(roomId, updateFields, {new: true} );
  return res.status(StatusCodes.OK).json(updatedRoom)

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const f = buildHandler({GET: getRoom, PATCH: patchRoom});
    await f(req, res);
  } catch (err) {
    return errorHandler(req, res, err);
  }
}
