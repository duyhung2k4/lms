import React, { useContext } from "react";
import TitleModal from "@/components/shared/title/modal.title";
import { Button, Grid, Group, Modal, NumberInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { FormGenerateSectionClass } from "../form";
import { SubjectDetailContext, type TypeSubjectDetailContext } from "..";
import { useNotification } from "@/hook";
import { useGenerateSectionClassesMutation } from "@/redux/api/subject";



export const ModalGenerateSectionClasses: React.FC = () => {
  // state
  const form = useForm<FormGenerateSectionClass>({
    initialValues: {
      number_of_section_class: 1,
      number_of_student: 30,
    },
    validate: {
      number_of_section_class: value => value < 1 ? "Số lớp học phần phải lớn hơp 1" : null,
      number_of_student: value => value < 30 ? "Số sinh viên mỗi lớp phải lớn hơn 30" : null,
    }
  });

  const {
    subjectId,
    semesterId,
    modalGenerateSectionClass,
    setModalGenerateSectionClass,
    onReload,
  } = useContext<TypeSubjectDetailContext>(SubjectDetailContext);



  // hook
  const noti = useNotification();



  // api
  const [gen, { isLoading }] = useGenerateSectionClassesMutation();



  // action
  const onClose = () => {
    setModalGenerateSectionClass(false);
    form.reset();
  }

  const onSubmit = async (values: FormGenerateSectionClass) => {
    try {
      const result = await gen({
        ...values,
        subject_id: subjectId,
        semester_id: semesterId,
      });

      if (result.error) throw "Xử lý yêu cầu thất bại"
      noti.success("Tạo lớp học phần thành công");
      onClose();
      form.reset();
      onReload();
    } catch (error) {
      noti.faild(`${error}`);
    }
  }



  return (
    <Modal
      opened={modalGenerateSectionClass}
      onClose={onClose}
      title={<TitleModal>Tạo lớp học phần</TitleModal>}
      closeOnClickOutside={false}
    >
      <Stack gap={24}>
        <form id="form-gen-section-class" onSubmit={form.onSubmit(onSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <NumberInput
                label="Số lớp học phần"
                placeholder="Nhập số lớp học phần"
                required
                min={1}
                {...form.getInputProps("number_of_section_class")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <NumberInput
                label="Số sinh viên mỗi lớp"
                placeholder="Nhập số sinh viên mỗi lớp"
                required
                min={30}
                {...form.getInputProps("number_of_student")}
              />
            </Grid.Col>
          </Grid>
        </form>
        <Group w={"100%"} justify="end">
          <Button
            type="submit"
            form="form-gen-section-class"
            disabled={isLoading}
            loading={isLoading}
          >Xác nhận</Button>
        </Group>
      </Stack>
    </Modal>
  )
}