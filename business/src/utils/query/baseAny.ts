import { ERROR_QUERY_DB } from "@root/src/constants/error";
import { Prisma } from "@root/src/generated/prisma";
import { prismaConnection } from "@root/src/infrastructure";
import dayjs from "dayjs";

export type BaseQueryType = {
  modelName: Prisma.ModelName,
  conditions: Record<any, any>,
  data: any,
  include?: Record<any, any>,
  omit?: Record<any, any>,
  orderBy?: Record<any, any>,
  select?: Record<any, any>,
  take?: number,
  skip?: number,
  distinct?: string[]
}

const getOne = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].findUnique({
      where: payload.conditions,
      include: payload.include,
      omit: payload.omit,
      orderBy: payload.orderBy,
      select: payload.select,
      take: payload.take,
      skip: payload.skip,
      distinct: payload.distinct,
    });

    if (!result) {
      throw ERROR_QUERY_DB.ITEM_NOT_FOUND;
    }

    return result
  } catch (error) {
    throw error;
  }
}

const getMany = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].findMany({
      where: payload.conditions,
      include: payload.include,
      omit: payload.omit,
      orderBy: payload.orderBy,
      select: payload.select,
      take: payload.take,
      skip: payload.skip,
      distinct: payload.distinct,
    });
    return result
  } catch (error) {
    throw error;
  }
}

const createOne = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].create({
      data: payload.data,
      include: payload.include,
      omit: payload.omit,
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const createMany = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].createMany(({
      data: payload.data,
    }));
    return result as Prisma.BatchPayload;
  } catch (error) {
    throw error;
  }
}

const updateOne = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].update({
      where: payload.conditions,
      data: {
        ...payload.data,
        updated_at: dayjs().toDate(),
      },
      include: payload.include,
      omit: payload.omit,
    });
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const updateMany = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].updateManyAndReturn({
      where: payload.conditions,
      data: [...payload.data].map(item => ({
        ...item,
        updated_at: dayjs().toDate(),
      })),
      include: payload.include,
      omit: payload.omit,
    });

    return result
  } catch (error) {
    throw error;
  }
}

const deleteOne = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].update({
      where: payload.conditions,
      data: { deleted_at: dayjs().toDate() },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const deleteMany = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].updateMany({
      where: payload.conditions,
      data: { deleted_at: dayjs().toDate() },
    });
    return result as Prisma.BatchPayload
  } catch (error) {
    throw error;
  }
}

const destroyOne = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].delete({
      where: payload.conditions,
    });
    return result as Prisma.BatchPayload
  } catch (error) {
    throw error;
  }
}

const destroyMany = async (payload: BaseQueryType) => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].deleteMany({
      where: payload.conditions,
    });
    return result as Prisma.BatchPayload
  } catch (error) {
    throw error;
  }
}

export const baseQueryAny = {
  getOne,
  getMany,
  createOne,
  createMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  destroyOne,
  destroyMany,
}