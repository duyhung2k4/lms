import { CreateSubjectRequest, GenerateSectionClassRequest } from "@root/src/dto/request/subject";
import { Prisma, section_classes, subjects } from "@root/src/generated/prisma";
import { prismaConnection } from "@root/src/infrastructure";
import { utils } from "@root/src/utils";

const handleCreateSubject = async (payload: CreateSubjectRequest): Promise<subjects> => {
  try {
    const result = await prismaConnection.subjects.create({
      data: {
        ...payload,
        code: utils.gen.genSubjectCode(),
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const handleGenerateSectionClass = async (payload: GenerateSectionClassRequest): Promise<section_classes[]> => {
  try {
    let result: section_classes[] = [];
    await prismaConnection.$transaction(async (tx) => {
      const subject = await tx.subjects.findUnique({ where: { id: payload.subject_id } });
      if (!subject) throw "subject not found!";
      // section_classes
      const newSectionClassInsert: Prisma.section_classesCreateManyInput[] = [];
      for (let i = 0; i < payload.number_of_section_class; i++) {
        newSectionClassInsert.push({
          name: "",
          code: utils.gen.genSectionClassCode(subject.code),
          semester_id: payload.semester_id,
          subject_id: payload.subject_id,
        })
      }
      const listSectionClasses = await tx.section_classes.createManyAndReturn({
        data: newSectionClassInsert,
      });

      // slot_section_classes
      const newSlotSectionClassInsert: Prisma.slot_section_classesCreateManyInput[] = [];
      listSectionClasses.forEach(item => {
        for (let i = 0; i < payload.number_of_student; i++) {
          newSlotSectionClassInsert.push({
            section_class_id: item.id,
            code: utils.gen.genUuid(),
          })
        }
      });
      await tx.slot_section_classes.createMany({
        data: newSlotSectionClassInsert,
      });
      result = listSectionClasses;
    })
    return result;
  } catch (error) {
    throw error;
  }
}

export const subjectService = {
  handleCreateSubject,
  handleGenerateSectionClass,
}