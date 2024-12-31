// import type { NextApiRequest, NextApiResponse } from 'next';
// import {buildHandler} from "../../../utils/build-handler";
// import {errorHandler} from "../../../utils/error-handler";
//
//
// async function processCallback(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { callbackData } = req.body; // Replace with your actual callback data structure
//
//     if (!callbackData) {
//       return res.status(400).json({ message: 'Callback data is required' });
//     }
//     // await saveCallbackData(callbackData);
//
//     // Redirect after processing (this is where the redirect logic goes)
//     res.end();
//   } catch (err) {
//     console.error('Error processing callback:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }
//
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const f =  buildHandler({ PATCH: processCallback });
//     await f(req, res);
//   } catch (err) {
//     return errorHandler(req, res, err);
//   }
// }

// callbackData
