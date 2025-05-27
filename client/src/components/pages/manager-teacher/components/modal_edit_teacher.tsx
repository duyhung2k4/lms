import React, { useContext } from "react";
import TitleModal from "@/components/shared/title/modal.title";
import { Button, Grid, Group, Modal, MultiSelect, Stack, TextInput } from "@mantine/core";
import { useAppSelector } from "@/redux/hook";
import { useForm } from "@mantine/form";
import { useNotification } from "@/hook";
import { utils } from "@/utils";
import { useCreateTeacherMutation } from "@/redux/api/profile";
import type { FormTeacher } from "../form";
import type { CreateProfileTeacherRequest } from "@/dto/request/profile";
import { ManagerTeacherContext, type TypeManagerTeacherContext } from "..";



export const ModalEditTeacher: React.FC = () => {
  // state
  const { departments } = useAppSelector(state => state.constant);
  const {
    editModalForm,
    setEditModalForm,
    onReload,
  } = useContext<TypeManagerTeacherContext>(ManagerTeacherContext);


  // hook
  const noti = useNotification();



  // other
  const form = useForm<FormTeacher>({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      departments: [],
    },
    validate: {
      email: value => utils.validate.validateEmail(value),
      first_name: value => utils.validate.validateNull(value),
      last_name: value => utils.validate.validateNull(value),
      phone: value => utils.validate.validateNull(value),
    }
  });



  // api
  const [create, { isLoading }] = useCreateTeacherMutation();



  // action
  const onSubmit = async (values: FormTeacher) => {
    try {
      const payload: CreateProfileTeacherRequest = {
        ...values,
        departments: values.departments.map(item => Number(item)),
      };

      const result = await create(payload);
      if(result.error) throw "Thêm mới tài khoản giáo viên thất bại!";
      noti.success("Thêm mới tài khoản thành công!");
      onClose();
      onReload();
    } catch (error) {
      noti.faild(`${error}`);
    }
  }

  const onClose = () => {
    if(isLoading) return;
    form.reset();
    setEditModalForm(false);
  }



  return (
    <Modal
      opened={editModalForm}
      onClose={onClose}
      title={<TitleModal>Tài khoản giáo viên</TitleModal>}
      closeOnClickOutside={false}
    >
      <Stack gap={24}>
        <form id="form-teacher" onSubmit={form.onSubmit(onSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Họ và tên đệm"
                placeholder="Nhập họ và tên đệm"
                required
                {...form.getInputProps("last_name")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Tên"
                placeholder="Nhập tên"
                required
                {...form.getInputProps("first_name")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Email"
                placeholder="Nhập email"
                required
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                required
                {...form.getInputProps("phone")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <MultiSelect
                label="Khoa trực thuộc"
                data={departments.map(item => ({ label: item.name, value: `${item.id}` }))}
                {...form.getInputProps("departments")}
              />
            </Grid.Col>
          </Grid>
        </form>
        <Group w={"100%"} justify="end">
          <Button
            type="submit"
            form="form-teacher"
            disabled={isLoading}
            loading={isLoading}
          >Xác nhận</Button>
        </Group>
      </Stack>
    </Modal>
  )
}