import "module-alias/register";
import runApp from ".";
import dotenv from "dotenv";
import { connectRabbitMQ } from "./infrastructure/connect_rabbitmq";
import { createCollection } from "./infrastructure/connect_typesense";

const init = async () => {
  try {
    // config
    dotenv.config();
    await createCollection();
    await connectRabbitMQ();
    await runApp();
  } catch (error) {
    console.log(error);
  }
}

init();