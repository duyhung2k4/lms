import "module-alias/register";
import runApp from ".";
import { prismaConnection } from "./infrastructure";

const init = async () => {
  try {
    await prismaConnection.$connect();
    runApp();
  } catch (error) {
    console.log(error);
  }
}

init();