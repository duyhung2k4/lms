import { getChannel, PayloadQueue, QUEUE_NAME } from "./infrastructure/connect_rabbitmq";
import { ConsumeMessage } from "amqplib";
import { typesenseClient } from "./infrastructure/connect_typesense";



const runApp = async () => {
    console.log("Service sync-typesense");
    const channel = getChannel();
    channel.consume(
        QUEUE_NAME,
        async (msg: ConsumeMessage | null) => {
            try {
                if (msg !== null) {
                const data = JSON.parse(msg.content.toString()) as PayloadQueue;
                data.data.forEach((_, index) => {
                    Object.keys(data.data[index]).map(key => {
                        if(!data.data[index][key]) {
                            data.data[index][key] = "";
                        }
                    })
                })
                switch (data.type) {
                    case "upsert":
                        await typesenseClient
                            .typesenseAdminClient
                            .collections(data.modelName)
                            .documents()
                            .import(data.data, { action: "upsert" });
                        channel.ack(msg);
                        break;
                    case "delete":
                        break;
                    default:
                        break;
                }
            }
            } catch (error) {
                console.log("LOGGGGGG-ERROR-RABBITMQ: ", error);
            }
        },
        { noAck: false }
    )
}

export const rootDir = __dirname;

export default runApp;