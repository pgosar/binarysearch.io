import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT } from "../../../utils/auth";
import { getUserProfile } from "../../../services/userService";
import { z } from 'zod';
import {UserSchema} from "../../models/User";

// Handler for getting user profile
async function getProfile(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    try {
        UserSchema.pick({ userId: true }).parse({ userId }); // Use pick to validate only userId part
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Invalid or missing userId', errors: error.errors });
        }
    }

    try {
        const profile = await getUserProfile(userId as string);
        if (!profile) {
            return res.status(404).json({ message: `Profile for user ${userId} not found` });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await authenticateJWT(req, res);

        switch (req.method) {
            case 'GET':
                return await getProfile(req, res);

            default:
                res.setHeader('Allow', ['GET']);
                return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
