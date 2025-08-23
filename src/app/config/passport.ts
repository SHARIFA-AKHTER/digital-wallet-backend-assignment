/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcryptjs";
// import { User } from "../modules/user/user.model";

// // Local strategy config
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

// // Optional: session support
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

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";

// ----------------------
// Local Strategy
// ----------------------
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (err) {
        return done(err);
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

        let user = await User.findOne({ email });

        if (!user) {
         
          user = await User.create({
            name: profile.displayName,
            email,
            password: null, 
            provider: "google",
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
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

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
