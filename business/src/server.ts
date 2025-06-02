import "module-alias/register";
import runApp from ".";
import dotenv from "dotenv";
import { prismaConnection } from "./infrastructure";
import { softDeleteMiddleware } from "./middlewares";
import { connectRabbitMQ } from "./infrastructure/connect_rabbitmq";
import { runCronJob, syncTypeSense } from "./jobs/cron";

const init = async () => {
  try {
    // config
    dotenv.config();

    prismaConnection.$use(softDeleteMiddleware);
    await prismaConnection.$connect();
    await connectRabbitMQ();
    await syncTypeSense();
    
    runCronJob();
    runApp();
  } catch (error) {
    console.log(error);
  }
}

init();