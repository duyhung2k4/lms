import { ACCOUNT } from "@root/src/constants/database";
import { CreateProfileTeacherRequest } from "@root/src/dto/request/profile";
import { prismaConnection } from "@root/src/infrastructure";
import { utils } from "@root/src/utils";

const handleCreateAccountTeacher = async (payload: CreateProfileTeacherRequest): Promise<void> => {
  try {
    const hassPassword = utils.password.hash(ACCOUNT.DEFAULT_PASSWORD);
    await prismaConnection.$transaction(async (tx) => {
      const newProfile = await tx.profiles.create({
        data: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: payload.email,
          phone: payload.phone,
          lms_code: utils.gen.genLmsCode(),
        },
      });

      await tx.users.create({
        data: {
          username: payload.email,
          hash_password: hassPassword,
          profile_id: newProfile.id,
        }
      });

      const departments = await tx.departments.findMany({
        where: {
          id: {
            in: payload.departments,
          }
        }
      });
      const profile_department_inserts = departments.map(item => ({
        profile_id: newProfile.id,
        department_id: item.id,
      }))
      await tx.profile_departments.createMany({
        data: profile_department_inserts,
      });
    })
  } catch (error) {
    throw error;
  }
}

export const profileService = {
  handleCreateAccountTeacher,
}