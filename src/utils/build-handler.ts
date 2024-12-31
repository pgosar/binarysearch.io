import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from 'src/pages/database';

type Method = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';

type CallbackParams = {
  [K in Method]?: (req: NextApiRequest, res: NextApiResponse) => Promise<NextApiResponse | void>;
};

export function buildHandler(callbacks: CallbackParams) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method as Method;

    if (!callbacks[method]) {
      throw Error('Method not allowed');
    }
    await dbConnect();
    await callbacks[method](req, res);
  };
}
