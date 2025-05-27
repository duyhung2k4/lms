import React, { useContext, useEffect, useMemo } from "react";
import TitleModal from "@/components/shared/title/modal.title";
import {
  Button,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ManagerDepartmentContext, type TypeManagerDepartmentContext } from "..";
import { MESSAGE } from "@/components/shared/mesage";
import { useNotification } from "@/hook";
import { useQueryMutation } from "@/redux/api/base";
import type { FormEditDepartment } from "../form";



export const ModalForm: React.FC = () => {
  // state
  const {
    departments,
    profiles,
    action,
    editModalForm,
    detailDepartment,
    setEditModalForm,
    setDetailDepartment,
    setAction,
    onReload,
  } = useContext<TypeManagerDepartmentContext>(ManagerDepartmentContext);

  const form = useForm<FormEditDepartment>({
    initialValues: {
      name: "",
      code: "",
    },
    validate: {
      name: value => value.length === 0 ? MESSAGE.VALIDATE.FORM_DEPARTMENT.name : null,
      code: (value) => validateCode(value),
    }
  });

  const validateCode = (code: string): string | null => {
    const duplicate = departments.find(item => item.code === code && item.id !== detailDepartment?.id);
    if(duplicate) return `Trùng mã với khoa ${duplicate.name}`;
    if(code.length === 0) return "Yêu cầu điền mã khoa";
    return null;
  }

  // hook
  const noti = useNotification();

  const actionName = useMemo(() => {
    let name = "";
    switch (action) {
      case "create":
        name = "Thêm mới khoa"
        break;
      case "update":
        name = "Chỉnh sửa khoa"
        break;
      default:
        break;
    }
    return name;
  }, [action]);

  // api
  const [query, { isLoading }] = useQueryMutation();



  // action
  const onClose = () => {
    if (isLoading) return;
    setEditModalForm(false);
    setDetailDepartment(null);
    setAction(null);
    form.reset();
  }

  const onSubmit = async (values: FormEditDepartment) => {
    if(!action) throw "action invalid!";
    if(values.owner_id) {
      (values as any).owner_id = Number(values.owner_id);
    }
    try {
      const result = await query({
        action,
        type: "one",
        modelName: "departments",
        conditions: detailDepartment ? { id: detailDepartment.id } : {},
        data: values,
      });
      if(result.error) throw `Có lỗi trong quá trình ${action === "create" ? "thêm mới" : "chỉnh sửa"}!`;
      onReload();
      onClose();
      noti.success(`${action === "create" ? "Thêm mới" : "Chỉnh sửa"} thành công`);
    } catch (error) {
      noti.faild(`${error}`);
    }
  }

  // trigger
  useEffect(() => {
    if (!detailDepartment) return;
    form.setValues({
      name: detailDepartment.name,
      code: detailDepartment.code,
      owner_id: `${detailDepartment.owner_id}`,
      description: detailDepartment.description,
    });
  }, [detailDepartment]);

  useEffect(() => {
    if (!validateCode(form.values.code)) return;
    if (form.values.code.length === 0) return;
    form.setFieldError("code", validateCode(form.values.code));
  }, [form.values.code]);



  return (
    <Modal
      opened={editModalForm}
      onClose={onClose}
      title={<TitleModal>{actionName}</TitleModal>}
      closeOnClickOutside={false}
    >
      <Stack gap={24}>
        <form id="form-department" onSubmit={form.onSubmit(onSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Tên khoa"
                placeholder="Nhập tên khoa"
                required
                {...form.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Mã khoa"
                placeholder="Nhập mã khoa"
                required
                {...form.getInputProps("code")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Select
                label="Quản lí khoa"
                placeholder="Chọn quản lí khoa"
                data={profiles.map(item => ({
                  label: `${item.last_name} ${item.first_name}`,
                  value: `${item.id}`,
                }))}
                {...form.getInputProps("owner_id")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Mô tả"
                autosize
                minRows={5}
                placeholder="Nhập mô tả"
                {...form.getInputProps("description")}
              />
            </Grid.Col>
          </Grid>
        </form>
        <Group w={"100%"} justify="end">
          <Button
            type="submit"
            form="form-department"
            disabled={isLoading}
            loading={isLoading}
          >Xác nhận</Button>
        </Group>
      </Stack>
    </Modal>
  )
}