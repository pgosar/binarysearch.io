import { NextApiRequest, NextApiResponse } from 'next';

async function processCallback(req: NextApiRequest, res: NextApiResponse) {
    try {

        const { callbackData } = req.body;  // Replace with your actual callback data structure

        if (!callbackData) {
            return res.status(400).json({ message: 'Callback data is required' });
        }
        // await saveCallbackData(callbackData);

        // Redirect after processing (this is where the redirect logic goes)
        res.end();
    } catch (error) {
        console.error('Error processing callback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            await processCallback(req, res);
        } else {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
