/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import bcrypt from "bcryptjs";
// import { User } from "../modules/user/user.model";

// passport.use(
//   new LocalStrategy(
//     { usernameField: "email", passwordField: "password" },
//     async (email, password, done) => {
//       try {
//         const user = await User.findOne({ email });
//         if (!user) return done(null, false, { message: "User not found" });

//         const isMatch = await bcrypt.compare(password, user.password!);
//         if (!isMatch) return done(null, false, { message: "Invalid credentials" });

//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// // ----------------------
// // Google Strategy
// // ----------------------
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       try {

//         const email = profile.emails?.[0].value;

//         let user = await User.findOne({ email });

//         if (!user) {

//           user = await User.create({
//             name: profile.displayName,
//             email,
//             password: null,
//             provider: "google",
//             googleId: profile.id,
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, false);
//       }
//     }
//   )
// );

// // ----------------------
// // Session Serialize/Deserialize
// // ----------------------
// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// export default passport;

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";
import { Document } from "mongoose";

// ----------------------
// User Type Interface
// ----------------------
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  provider?: string;
  googleId?: string;
}

// ----------------------
// Local Strategy
// ----------------------
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Password not set for this account",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// ----------------------
// Google Strategy
// ----------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, {
            message: "Email not found in Google profile",
          });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            password: undefined, // Google user doesn't need a password
            provider: "google",
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);

// ----------------------
// Session Serialize/Deserialize
// ----------------------
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
