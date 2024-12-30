import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from 'src/pages/database';

type HandlerArgs = {
  getCallback?: Function;
  postCallback?: Function;
  patchCallback?: Function;
  putCallback?: Function;
  deleteCallback?: Function;
};

export function buildHandler(callbackFunctions: HandlerArgs) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const callbacks: Record<string, Function | undefined> = {
      GET: callbackFunctions.getCallback,
      PATCH: callbackFunctions.patchCallback,
      POST: callbackFunctions.postCallback,
      PUT: callbackFunctions.putCallback,
      DELETE: callbackFunctions.deleteCallback,
    };

    // await authenticateJWT(req, res);
    await dbConnect();
    const callback = callbacks[req.method ?? ''];

    if (callback !== undefined) {
      callback(req, res);
    } else {
      throw Error('Method not found!');
    }
  };
}
