import React, { useContext, useEffect, useMemo } from "react";
import TitleModal from "@/components/shared/title/modal.title";
import {
  Button,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNotification } from "@/hook";
import { useQueryMutation } from "@/redux/api/base";
import { ManagerSubjectContext, type TypeManagerSubjectContext } from "..";
import { useAppSelector } from "@/redux/hook";
import { utils } from "@/utils";
import type { FormEditSubject } from "../form";



export const ModalForm: React.FC = () => {
  // state
  const {
    action,
    editModalForm,
    detailSubject,
    setEditModalForm,
    setDetailSubject,
    setAction,
    onReload,
  } = useContext<TypeManagerSubjectContext>(ManagerSubjectContext);

  const { departments } = useAppSelector(state => state.constant);

  const form = useForm<FormEditSubject>({
    initialValues: {
      name: "",
      number_of_credit: 2,
      number_of_lessons: 10,
      unit: 300000,
      department_id: "0",
    },
    validate: {
      name: value => utils.validate.validateNull(value),
      number_of_credit: value => value < 2 || value > 10 ? "Số tín không hợp lệ" : null,
      number_of_lessons: value => value < 10 || value > 100 ? "Số tiết không hợp lệ" : null,
      department_id: value => Number(value || 0) === 0 ? "Yêu cầu chọn khoa quản lí" : null,
    }
  });

  // hook
  const noti = useNotification();

  const actionName = useMemo(() => {
    let name = "";
    switch (action) {
      case "create":
        name = "Thêm mới môn học"
        break;
      case "update":
        name = "Chỉnh sửa môn học"
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
    setDetailSubject(null);
    setAction(null);
    form.reset();
  }

  const onSubmit = async (values: FormEditSubject) => {
    if (!action) throw "action invalid!";
    try {
      const result = await query({
        action,
        type: "one",
        modelName: "subjects",
        conditions: detailSubject ? { id: detailSubject.id } : {},
        data: {
          ...values,
          department_id: Number(values.department_id),
        },
      });
      if (result.error) throw `Có lỗi trong quá trình ${action === "create" ? "thêm mới" : "chỉnh sửa"}!`;
      onReload();
      onClose();
      noti.success(`${action === "create" ? "Thêm mới" : "Chỉnh sửa"} thành công`);
    } catch (error) {
      noti.faild(`${error}`);
    }
  }

  // trigger
  useEffect(() => {
    if (!detailSubject) return;
    form.setValues({
      name: detailSubject.name,
      number_of_credit: detailSubject.number_of_credit,
      number_of_lessons: detailSubject.number_of_lessons,
      unit: detailSubject.unit,
      department_id: `${detailSubject.department_id}`,
    });
  }, [detailSubject]);



  return (
    <Modal
      opened={editModalForm}
      onClose={onClose}
      title={<TitleModal>{actionName}</TitleModal>}
      closeOnClickOutside={false}
    >
      <Stack gap={24}>
        <form id="form-subject" onSubmit={form.onSubmit(onSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Tên môn học"
                placeholder="Nhập tên môn học"
                required
                {...form.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <NumberInput
                label="Số tín chỉ"
                placeholder="Nhập Số tín chỉ"
                min={2}
                max={20}
                required
                {...form.getInputProps("number_of_credit")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <NumberInput
                label="Số tiết học"
                placeholder="Nhập Số tiết học"
                required
                min={10}
                max={100}
                {...form.getInputProps("number_of_lessons")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <NumberInput
                label="Giá tiền tín chỉ"
                placeholder="Nhập giá tiền tín chỉ"
                required
                min={300000}
                {...form.getInputProps("unit")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Select
                label="Khoa quản lí"
                placeholder="Nhập khoa quản lí"
                required
                data={departments.map(item => ({
                  label: item.name,
                  value: `${item.id}`
                }))}
                {...form.getInputProps("department_id")}
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
            form="form-subject"
            disabled={isLoading}
            loading={isLoading}
          >Xác nhận</Button>
        </Group>
      </Stack>
    </Modal>
  )
}