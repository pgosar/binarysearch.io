import { z } from 'zod';
import { extendZod, zodSchema } from '@zodyac/zod-mongoose';
import {model} from "mongoose";

extendZod(z);

export const zRoom = z.object({
    roomId: z.string().unique(),
    socketId: z.number().unique(),
    participants: z.array(z.string().unique()), // Array of userIds
    code: z.string(),
    tags: z.array(z.string()),
    leader: z.string(), // userId
});

export const roomSchema = zodSchema(zRoom);
export const roomModel = model("Room", roomSchema);
