import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT } from "../../../utils/auth";
import { getUserFromDb, updateUserInDb, deleteUserFromDb } from "../../../services/userService"; // Assume these are service functions
import { z } from 'zod';
import {UserSchema} from "../../models/User";

// Handler for GET request to fetch a user
async function getUser(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId } = req.query;

        // Validate userId with Zod (ensure it's a string)
        const validatedUserId = z.string().parse(userId);

        if (!validatedUserId) {
            return res.status(400).json({ message: 'userId is required and must be a string' });
        }

        const user = await getUserFromDb(validatedUserId);

        if (!user) {
            return res.status(404).json({ message: `User with id ${validatedUserId} not found` });
        }

        res.status(200).json({ message: `User details for ${validatedUserId}`, data: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Handler for PATCH request to update user
async function patchUser(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId } = req.query;
        const { username, email, role, profile, experience, currentRoomCode } = req.body;

        // Validate userId using Zod
        const validatedUserId = z.string().parse(userId);

        // Validate the body data with the full UserSchema
        const validatedUserData = UserSchema.pick({
            userId: true,
            username: true,
            email: true,
            role: true,
            profile: true,
            experience: true,
            currentRoomCode: true
        }).parse({
            username,
            email,
            role,
            profile,
            experience,
            currentRoomCode
        });

        // Check if all required fields are present
        if (!validatedUserId || !validatedUserData) {
            return res.status(400).json({ message: 'userId, username, email, role, profile, experience, and currentRoomCode are required to update the user' });
        }

        // Update user in the database
        const updatedUser = await updateUserInDb(validatedUserId, validatedUserData);

        if (!updatedUser) {
            return res.status(404).json({ message: `User with id ${validatedUserId} not found` });
        }

        res.status(200).json({ message: `User ${validatedUserId} updated successfully`, data: updatedUser });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle Zod validation errors
            return res.status(400).json({ message: 'Invalid data', errors: error.errors });
        }

        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Handler for DELETE request to delete a user
async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId } = req.query;

        // Validate userId using Zod
        const validatedUserId = z.string().parse(userId);

        if (!validatedUserId) {
            return res.status(400).json({ message: 'userId is required to delete the user' });
        }

        const deletedUser = await deleteUserFromDb(validatedUserId);

        if (!deletedUser) {
            return res.status(404).json({ message: `User with id ${validatedUserId} not found` });
        }

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Main handler to dispatch to the correct function based on HTTP method
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await authenticateJWT(req, res);

        switch (req.method) {
            case 'GET':
                return await getUser(req, res);

            case 'PATCH':
                return await patchUser(req, res);

            case 'DELETE':
                return await deleteUser(req, res);

            default:
                res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
                return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
