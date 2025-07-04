import { Client } from "typesense";
import { CollectionCreateOptions, CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { Prisma } from "../generated/prisma";

const typesenseAdminClient = new Client({
  nodes: [
    {
      host: 'localhost', // hoặc IP/host của server
      port: 8108,
      protocol: 'http'
    }
  ],
  apiKey: 'XEh2vla5fsBBIG3scTtNmIrhkrXogiTY', // Admin API Key
  connectionTimeoutSeconds: 2
});

const typesenseSearchClient = new Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http'
    }
  ],
  apiKey: 'K7iyLuywV7EVfr5nOgkFDLuQzkGRHBxI',
  connectionTimeoutSeconds: 2
});

export const createCollection = async () => {
    try {
        const collectionExist = await typesenseAdminClient.collections().retrieve();
        const collectionCreate : CollectionCreateSchema<CollectionCreateOptions>[] = [
            {
                name: Prisma.ModelName.subjects,
                fields: [
                    { name: "id", type: "string" },
                    { name: "name", type: "string" },
                    { name: "code", type: "string" },
                    { name: "description", type: "string" },
                    { name: "number_of_credit", type: "int32" },
                    { name: "number_of_lessons", type: "int32" },
                    { name: "unit", type: "float" },
                    { name: "department_id", type: "int64" },
                ]
            },
            {
                name: Prisma.ModelName.departments,
                fields: [
                    { name: "id", type: "string" },
                    { name: "name", type: "string" },
                    { name: "code", type: "string" },
                    { name: "description", type: "string" },
                ]
            },
            {
                name: Prisma.ModelName.profiles,
                fields: [
                    { name: "id", type: "string" },
                    { name: "first_name", type: "string" },
                    { name: "last_name", type: "string" },
                    { name: "email", type: "string" },
                    { name: "phone", type: "string" },
                    { name: "lms_code", type: "string" },
                    { name: "status", type: "bool" },
                ]
            },
            {
                name: Prisma.ModelName.semesters,
                fields: [
                    { name: "id", type: "string" },
                    { name: "name", type: "string" },
                    { name: "description", type: "string" },
                    // { name: "start_time", type: "string" },
                    // { name: "end_time", type: "int32" },
                    { name: "school_year_id", type: "int32" },
                ]
            }
        ];
        const collectionNotFound = collectionCreate.filter(item => !collectionExist.find(c => c.name === item.name));

        const createCollections = collectionNotFound.map(item => {
            return typesenseAdminClient.collections().create(item);
        });
        await Promise.all(createCollections);
    } catch (error) {
        throw error;
    }
}

export const typesenseClient = {
    typesenseAdminClient,
    typesenseSearchClient,
}