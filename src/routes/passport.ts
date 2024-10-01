import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../../db";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "/api/auth/callback/google",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findUnique({
                    where: { googleId: profile.id },
                });
                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            googleId: profile.id,
                            name: profile.displayName,
                        },
                    });
                }
                return done(null, user);
            } catch (e) {
                done(null, false);
                // Pass the error to done, it will be handled in the callback route
            }
        }
    )
);

passport.serializeUser(function (user: { id: string }, done) {
    // Only the user ID is serialized to the session, keeping the session data minimal.
    done(null, user.id);
});

// The ID is used to fetch the user from the database or user service.
passport.deserializeUser(function (providedId: string, done) {
    prisma.user
        .findUnique({
            where: {
                id: providedId,
            },
        })
        .then((user) => {
            done(null, user); // Returning the entire user object
        })
        .catch((err) => {
            done(err);
        });
});

export default passport;
