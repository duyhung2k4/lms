import "module-alias/register";
import runApp from ".";
import dotenv from "dotenv";
import { prismaConnection } from "./infrastructure";
import { softDeleteMiddleware } from "./middlewares";

const init = async () => {
  try {
    // config
    dotenv.config();
    prismaConnection.$use(softDeleteMiddleware);
    await prismaConnection.$connect();
    runApp();
  } catch (error) {
    console.log(error);
  }
}

init();