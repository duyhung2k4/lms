import "module-alias/register";
import runApp from ".";
import { prismaConnection } from "./infrastructure";
import { softDeleteMiddleware } from "./middlewares";

const init = async () => {
  try {
    prismaConnection.$use(softDeleteMiddleware);
    await prismaConnection.$connect();
    runApp();
  } catch (error) {
    console.log(error);
  }
}

init();