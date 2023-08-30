import mongoose from "mongoose";
import { DATABASE_CONNNECTION } from "../config/index.js";

const connectDb = async () => {
  try {
    const con = await mongoose.connect(DATABASE_CONNNECTION);
    console.log(`database is connected to the HOST:${con.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
