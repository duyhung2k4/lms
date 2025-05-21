import { ERROR_QUERY_DB } from "@root/src/constants/error";
import { Prisma } from "@root/src/generated/prisma";
import { prismaConnection } from "@root/src/infrastructure";

export type BaseFilterType = {
  modelName: Prisma.ModelName,
  conditions: Record<any, any>,
  include?: Record<any, any>,
  omit?: Record<any, any>,
}

const getOne = async <T>(payload: BaseFilterType): Promise<T> => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].findUnique({
      where: payload.conditions,
      include: payload.include,
      omit: payload.omit,
    });

    if (!result) {
      throw ERROR_QUERY_DB.ITEM_NOT_FOUND;
    }

    return result as T
  } catch (error) {
    throw error;
  }
}

const getMany = async <T>(payload: BaseFilterType): Promise<T[]> => {
  try {
    const result = await (prismaConnection as any)[payload.modelName].findMany({
      where: payload.conditions,
      include: payload.include,
      omit: payload.omit,
    });
    return result as T[]
  } catch (error) {
    throw error;
  }
}

const createOne = async <T, D>(
  modelName: Prisma.ModelName,
  data: D,
  include?: Record<any, any>,
  omit?: Record<any, any>,
): Promise<T> => {
  try {
    const result = await (prismaConnection as any)[modelName].create({
      data,
      include,
      omit,
    });
    return result as T;
  } catch (error) {
    throw error;
  }
}

const createMany = async <T>(
  modelName: Prisma.ModelName,
  data: T[],
): Promise<Prisma.BatchPayload> => {
  try {
    const result = await (prismaConnection as any)[modelName].createMany(({
      data,
    }));
    return result as Prisma.BatchPayload;
  } catch (error) {
    throw error;
  }
}

const updateOne = async <T>(
  modelName: Prisma.ModelName,
  condition: Record<any, any>,
  newData: Record<any, any>,
  include?: Record<any, any>,
  omit?: Record<any, any>,
): Promise<T> => {
  try {
    const result = await (prismaConnection as any)[modelName].update({
      where: condition,
      data: {
        ...newData,
        updated_at: Date.now(),
      },
      include,
      omit,
    });
    return result as T
  } catch (error) {
    throw error;
  }
}

const updateMany = async <T>(
  modelName: Prisma.ModelName,
  condition: Record<any, any>,
  newData: Record<any, any>,
  include?: Record<any, any>,
  omit?: Record<any, any>,
): Promise<T[]> => {
  try {
    const result = await (prismaConnection as any)[modelName].updateManyAndReturn({
      where: condition,
      data: newData,
      include,
      omit,
    });

    return result as T[]
  } catch (error) {
    throw error;
  }
}

const deleteOne = async <T>(
  modelName: Prisma.ModelName,
  condition: Record<any, any>,
): Promise<T> => {
  try {
    const result = await (prismaConnection as any)[modelName].delete({
      where: condition,
    });
    return result as T;
  } catch (error) {
    throw error;
  }
}

const deleteMany = async <T>(
  modelName: Prisma.ModelName,
  condition: Record<any, any>,
): Promise<Prisma.BatchPayload> => {
  try {
    const result = await (prismaConnection as any)[modelName].deleteMany({
      where: condition,
    });
    return result as Prisma.BatchPayload
  } catch (error) {
    throw error;
  }
}

const check = async () => {
  const reult = await prismaConnection.users.findMany({
    where: {
      id: {
        in:[]
      },
    },
  })
}

export const baseQuery = {
  getOne,
  getMany,
  createOne,
  createMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
}