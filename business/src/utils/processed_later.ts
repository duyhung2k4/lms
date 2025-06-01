import { BaseQueryAnyRequest } from "../dto/base";
import { getChannel, PayloadQueue, QUEUE_NAME } from "../infrastructure/connect_rabbitmq";
import { typesenseClient } from "../infrastructure/connect_typesense";

export const processedLaterBaseQuery = async (payload: BaseQueryAnyRequest, result: any) => {
    let channel = getChannel();
    switch (payload.type) {
        case "one":
            let newResult = result as Record<any, any>;
            if(newResult["id"]) {
                newResult = {
                    ...newResult,
                    id: `${newResult["id"]}`,
                }
            }
            switch (payload.action) {
                case "create":
                case "update":
                    // await typesenseClient
                    //     .typesenseAdminClient
                    //     .collections("subjects")
                    //     .documents()
                    //     .import([newResult], { action: "upsert" });
                    let msg: PayloadQueue = {
                        modelName: payload.modelName,
                        type: "upsert",
                        data: [newResult],
                    }
                    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)));
                    break;
                default:
                    break;
            }
            break;
        case "many":
            let newResults = result as Record<any, any>[];
            newResults.forEach((_, index) => {
                newResults[index] = {
                    ...newResults[index],
                    id: `${newResult["id"]}`,
                }
            })
            switch (payload.action) {
                case "create":
                case "update":
                    // await typesenseClient
                    //     .typesenseAdminClient
                    //     .collections("subjects")
                    //     .documents()
                    //     .import(newResults, { action: "upsert" });
                    let msg: PayloadQueue = {
                        modelName: payload.modelName,
                        type: "upsert",
                        data: newResults,
                    }
                    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)));
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}