import { BaseQueryAnyRequest } from "../dto/base";
import { Prisma } from "../generated/prisma";
import { getChannel, PayloadQueue, QUEUE_NAME } from "../infrastructure/connect_rabbitmq";

export const processedLaterBaseQuery = async (payload: BaseQueryAnyRequest, result: any) => {
    let listModelNameTrigger = [
        Prisma.ModelName.departments,
        Prisma.ModelName.profiles,
        Prisma.ModelName.semesters,
        Prisma.ModelName.subjects,
    ]
    let modelName = listModelNameTrigger.find(item => item === payload.modelName);
    if (!modelName) return;

    let channel = getChannel();
    switch (payload.type) {
        case "one":
            let newResult = result as Record<any, any>;
            if (newResult["id"]) {
                newResult = {
                    ...newResult,
                    id: `${newResult["id"]}`,
                }
            }
            switch (payload.action) {
                case "create":
                case "update":
                    let msg: PayloadQueue = {
                        modelName,
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
                    let msg: PayloadQueue = {
                        modelName,
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