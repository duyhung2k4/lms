import "module-alias/register";
import runApp from ".";
import { prismaConnection } from "./infrastructure";
import { softDeleteMiddleware } from "./middlewares";
import { createCollection } from "./infrastructure/connect_typesense";
import { connectRabbitMQ } from "./infrastructure/connect_rabbitmq";

const init = async () => {
  try {
    prismaConnection.$use(softDeleteMiddleware);
    await prismaConnection.$connect();
    await createCollection();
    await connectRabbitMQ();
    runApp();
  } catch (error) {
    console.log(error);
  }
}

init();