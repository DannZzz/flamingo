import express, { Router } from "express";
import path from "path";

const profileRouter = Router();
const p = path.join(path.resolve(), "./public/profile");
profileRouter.use("/*", express.static(p))

export default profileRouter;
