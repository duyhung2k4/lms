import dayjs from "dayjs";
import { Prisma } from "../generated/prisma";
import { prismaConnection } from "../infrastructure";
import { typesenseClient } from "../infrastructure/connect_typesense";

export const runCronJob = () => {
  setInterval(async () => {
    await syncTypeSense();
  }, 1000 * 5 * 1);
}

export const syncTypeSense = async () => {
  const listQuery = [
    prismaConnection.subjects.findMany({ where: {} }),
    prismaConnection.departments.findMany({ where: {} }),
    prismaConnection.semesters.findMany({ where: {} }),
    prismaConnection.profiles.findMany({ where: {} }),
  ];

  let [subjects, departments, semesters, profiles] = await Promise.all(listQuery);

  const listSync = [
    syncCollections(subjects, "subjects"),
    syncCollections(departments, "departments"),
    syncCollections(semesters, "semesters"),
    syncCollections(profiles, "profiles"),
  ];
  await Promise.all(listSync);
  console.log(`${dayjs().format("YYYY-MM-DD+HH:mm:ss").toString()}: Sync successfully!`);
}

const syncCollections = async (data: Record<any, any>[], collectionName: Prisma.ModelName) => {
  try {
    const newData = data.map(item => {
      let newItem = {
        ...item,
        id: `${item.id}`
      } as Record<any, any>;
      Object.keys(newItem).forEach(key => {
        if (!newItem[key]) {
          newItem[key] = "";
        }
      })
      return newItem;
    })
    await typesenseClient
      .typesenseAdminClient
      .collections(collectionName)
      .documents()
      .import(newData, { action: "upsert" });
  } catch (error) {
    console.log("Error syncCollections: ", error);
  }
}