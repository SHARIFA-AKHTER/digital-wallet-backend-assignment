import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";


dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;


const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("✅ Connected to MongoDB!");
   server = app.listen(envVars.PORT,  () => {
      console.log(`✅ Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer()

