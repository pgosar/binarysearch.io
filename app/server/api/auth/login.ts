import { NextApiRequest, NextApiResponse } from 'next';

// Function to handle login redirection
async function redirectToLogin(req: NextApiRequest, res: NextApiResponse) {
    try {
        // You can dynamically set the redirect URL based on query params, environment variables, etc.
        const loginUrl = process.env.AUTH_PROVIDER_URL || '......';
        if (req.method == ('hi'))

        // Perform the redirect (301 Moved Permanently)
        res.writeHead(301, { Location: loginUrl });
        res.end();
    } catch (error) {
        console.error('Error during login redirect:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            await redirectToLogin(req, res);
        } else {
            res.setHeader('Allow', ['GET']);
            return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
