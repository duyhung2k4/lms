import amqplib from "amqplib";
import { Prisma } from "../generated/prisma";

let rbConnection: amqplib.ChannelModel;
let channel: amqplib.Channel;

export const QUEUE_NAME = "sync-collections"

export const connectRabbitMQ = async () => {
  try {
    rbConnection = await amqplib.connect(process.env.RABBITMQ_URL || "");
    channel = await rbConnection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
  } catch (error) {
    console.log("Error connect rabbit-mq: ", error);
  }
}

export type PayloadQueue = {
  modelName: Prisma.ModelName
  data: Record<any, any>[]
  type: "upsert" | "delete"
}

export const getRabbitMQConnection = () => rbConnection;
export const getChannel = () => channel;