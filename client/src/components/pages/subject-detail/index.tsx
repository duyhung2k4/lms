import React, { createContext, useEffect, useState } from "react";
import { useFilterQuery } from "@/redux/api/base";
import { Button, Grid, Group, Select, Stack, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useParams, useSearchParams } from "react-router";
import type { SemesterModel } from "@/models/semester";
import { ModalGenerateSectionClasses, SectionClass } from "./components";
import { useNotification } from "@/hook";
import type { SectionClassModel } from "@/models/section_classes";
import type { SubjectModel } from "@/models/subject";



const searchParamsKey = {
  semester_id: "semester_id",
}

const SubjectDetail: React.FC = () => {
  // stage
  const { code } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [semesterId, setSemesterId] = useState<string>("0");
  const [modalGenerateSectionClass, setModalGenerateSectionClass] = useState<boolean>(false);



  // hook
  const noti = useNotification();



  // api
  const {
    data: dataSemester,
    refetch: refetchSemester,
  } = useFilterQuery({
    modelName: "semesters",
    conditions: {},
    type: "many",
    action: "read",
    data: {},
    orderBy: {
      name: "asc"
    }
  });
  const semesters = (dataSemester?.data || []) as SemesterModel[];

  const {
    data: dataSubject,
    refetch: refetchSubject,
  } = useFilterQuery({
    modelName: "subjects",
    conditions: {
      code: code || "",
    },
    type: "one",
    action: "read",
    data: {},
  });
  const subject = dataSubject?.data as SubjectModel | null

  const {
    data: dataSectionClasses,
    refetch: refetchSectionClass,
  } = useFilterQuery({
    modelName: "section_classes",
    conditions: {
      subject_id: Number(subject?.id || 0),
      semester_id: Number(semesterId || 0),
    },
    type: "many",
    action: "read",
    data: {},
    include: {
      slot_section_classes: true,
      subject: true,
    },
    orderBy: {
      id: "asc"
    }
  });
  const sectionClasses = (dataSectionClasses?.data || []) as SectionClassModel[];
  console.log(sectionClasses);



  // action
  const onGenerate = () => {
    if (!subject?.id || semesterId === "0") {
      noti.warning("Chưa chọn kì học hoặc môn học cụ thể!");
      return;
    }
    setModalGenerateSectionClass(true);
  }

  const onReload = () => {
    refetchSectionClass();
    refetchSemester();
  }



  // trigger
  useEffect(() => {
    refetchSubject();
    refetchSemester();
  }, [code]);

  useEffect(() => {
    if (semesters.length === 0) return;
    if (searchParams.get(searchParamsKey.semester_id)) return;
    setSemesterId(`${semesters[0].id}`);
  }, [semesters]);

  useEffect(() => {
    if (semesterId === "0") return;
    searchParams.set(searchParamsKey.semester_id, semesterId);
    setSearchParams(searchParams);
  }, [semesterId]);

  useEffect(() => {
    setSemesterId(searchParams.get(searchParamsKey.semester_id) || "0");
  }, [searchParams.get(searchParamsKey.semester_id)]);

  useEffect(() => {
    refetchSectionClass();
  }, [code, semesterId]);



  return (
    <SubjectDetailContext.Provider
      value={{
        subjectId: subject?.id || 0,
        semesterId: Number(semesterId || 0),
        modalGenerateSectionClass,
        setModalGenerateSectionClass,
        onReload,
      }}
    >
      <Stack w={"100%"} h={"100%"}>
        <Group justify="space-between" align="center">
          <TextInput
            maw={"50%"}
            flex={1}
            leftSection={<IconSearch />}
            placeholder="Tìm kiếm lớp học phần"
          />
          <Select
            placeholder="Chọn kì học"
            value={semesterId}
            onChange={value => {
              value && setSemesterId(value);
            }}
            data={semesters.map(item => ({
              label: item.name,
              value: `${item.id}`
            }))}
          />
        </Group>
        <Stack
          flex={1}
          w={"100%"}
          style={{
            overflow: "scroll",
            maxHeight: "100%",
            overflowX: "hidden",
          }}
        >
          {sectionClasses.length === 0 &&
            <Group
              w={"100%"}
              h={"100%"}
              justify="center"
              align="center"
            >
              <Button
                onClick={onGenerate}
                leftSection={<IconPlus />}
              >Tạo lớp học phần</Button>
            </Group>
          }
          {
            sectionClasses.length > 0 &&
            <Grid>
              {
                sectionClasses.map(item => (
                  <Grid.Col 
                    key={item.id} 
                    span={{
                      xs: 12,
                      md: 6,
                      lg: 4,
                      xl: 3,
                    }}
                  >
                    <SectionClass
                      data={item}
                    />
                  </Grid.Col>
                ))
              }
            </Grid>
          }
        </Stack>
      </Stack>
      <ModalGenerateSectionClasses />
    </SubjectDetailContext.Provider>
  )
}

export type TypeSubjectDetailContext = {
  subjectId: number,
  semesterId: number,
  modalGenerateSectionClass: boolean,
  setModalGenerateSectionClass: (_: boolean) => void,
  onReload: () => void
};
export const SubjectDetailContext = createContext<TypeSubjectDetailContext>({
  subjectId: 0,
  semesterId: 0,
  modalGenerateSectionClass: false,
  setModalGenerateSectionClass: (_: boolean) => { },
  onReload: () => { },
});

export default SubjectDetail;