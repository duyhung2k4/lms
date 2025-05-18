import "module-alias/register";
import runApp from ".";
import prisma from "./infrastructure/connect_database";

const init = async () => {
  try {
    await prisma.$connect();
    runApp();
  } catch (error) {
    console.log(error);
  }
}

init();