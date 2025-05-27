import { Prisma } from "../generated/prisma";


export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  const modelNames = Object.keys(Prisma.ModelName).map(item => item ).filter(item => !!item);
  const modelsWithSoftDelete = new Set(modelNames);

  const actionsToFilter = new Set([
    "findFirst", "findMany", "findUnique", "count", "aggregate", "groupBy",
  ]);

  const model = params.model;
  const action = params.action;

  if (model && actionsToFilter.has(action) && modelsWithSoftDelete.has(model)) {
    if (!params.args.where) {
      params.args.where = {};
    }

    if (params.args.where.deleted_at === undefined) {
      params.args.where.deleted_at = null;
    }
  }

  return next(params);
};
