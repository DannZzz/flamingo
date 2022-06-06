import mongoose from "mongoose";
import config from "../config";

export default () => {
    mongoose.connect(process.env.MONGO || config.MONGO).catch(e => {console.log(e)})
    mongoose.set("bufferCommands", true)
};