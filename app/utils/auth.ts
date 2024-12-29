import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    return new Promise((resolve, reject) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return reject(res.status(401).json({ message: 'Unauthorized' }));
        }

        jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
            if (err) {
                return reject(res.status(403).json({ message: 'Forbidden' }));
            }
            req.user = user;
            resolve();
        });
    });
};
