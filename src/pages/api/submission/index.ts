import type { NextApiRequest, NextApiResponse } from 'next';

import {buildHandler} from "../../../utils/build-handler";
import {errorHandler} from "../../../utils/error-handler";
import {StatusCodes} from "http-status-codes";

async function postCallback(_req: NextApiRequest, res: NextApiResponse) {

    return res.status(StatusCodes.NOT_IMPLEMENTED)

}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const f =  buildHandler({POST: postCallback });
    await f(req, res);
  } catch (err) {
    return errorHandler(req, res, err);
  }
}
