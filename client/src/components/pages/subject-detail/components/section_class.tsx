import type { SectionClassModel } from "@/models/section_classes";
import { Button, Group, Stack, Text } from "@mantine/core";
import React, { useMemo } from "react";


export type SectionClassProps = {
  data: SectionClassModel
}
export const SectionClass: React.FC<SectionClassProps> = (props) => {
  const sectionClass = props.data;

  const studentRegister = useMemo(() => {
    return sectionClass.slot_section_classes?.filter(item => item.register !== undefined) || [];
  }, [sectionClass]);



  return (
    <Stack
      w={"100%"}
      h={"100%"}
      style={{
        borderRadius: 4,
      }}
      gap={0}
    >
      <Group
        style={{
          backgroundColor: "#6E54B5",
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          padding: 8,
        }}
      >{sectionClass.code}</Group>
      <Stack
        style={{
          padding: 8,
          borderTop: "0px !important",
          borderLeft: "2px solid #969696",
          borderRight: "2px solid #969696",
          borderBottom: "2px solid #969696",
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        <Text>Người dạy: {
          sectionClass.teacher ?
            `${sectionClass.teacher.last_name} ${sectionClass.teacher.first_name}`
            : "Chưa phân công"}
        </Text>
        <Text>Đã đăng kí: {studentRegister.length}</Text>
        <Text>Số lượng sinh viên: {sectionClass.slot_section_classes?.length}</Text>
        <Button
          variant="outline"
        >Phân lớp</Button>
      </Stack>
    </Stack>
  )
}