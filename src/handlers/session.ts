import { PrismaClient } from "@prisma/client";
import { Store } from "express-session";

class PrismaSessionStore extends Store {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        super();
        this.prisma = prisma;
    }

    // Ensure methods are defined as properties holding function values
    get = async (
        sid: string,
        callback: (err?: any, session?: Express.SessionData | null) => void
    ): Promise<void> => {
        try {
            const session = await this.prisma.session.findUnique({
                where: { id: sid },
            });
            if (session) {
                const data = JSON.parse(
                    session.data as string
                ) as Express.SessionData;
                callback(null, data);
            } else {
                callback();
            }
        } catch (err) {
            callback(err);
        }
    };

    set = async (
        sid: string,
        session: Express.SessionData,
        callback: (err?: any) => void
    ): Promise<void> => {
        try {
            const data = JSON.stringify(session);
            let expires: Date | undefined;

            // Check if 'expires' is a Date object or a valid date string/number; otherwise, handle the 'true' case.
            if (session.cookie.expires instanceof Date) {
                expires = session.cookie.expires; // It's already a Date object
            } else if (
                typeof session.cookie.expires === "string" ||
                typeof session.cookie.expires === "number"
            ) {
                expires = new Date(session.cookie.expires); 
            } else {
                expires = undefined; 
            }

            await this.prisma.session.upsert({
                where: { id: sid },
                update: { data, expires },
                create: { id: sid, data, expires },
            });

            callback();
        } catch (err) {
            callback(err);
        }
    };

    destroy = async (
        sid: string,
        callback: (err?: any) => void
    ): Promise<void> => {
        try {
            const session = await this.prisma.session.findUnique({
                where: { id: sid },
            });
    
            if (session) {
                // Delete the session from the database
                await this.prisma.session.delete({
                    where: { id: sid },
                });
    
            } else {
                console.log('Session not found or already expired');
            }
    
            callback();
        } catch (error) {
            console.error('Error while destroying session:', error);
            callback(error);
        }
    };
    
}

export default PrismaSessionStore;
