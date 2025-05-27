import React, { useContext, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import TitleModal from "@/components/shared/title/modal.title";
import {
  Button,
  Grid,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from '@mantine/dates';
import { useForm } from "@mantine/form";
import {
  ManagerSemesterContext,
  type TypeManagerSemesterContext,
} from "..";
import { utils } from "@/utils";
import { useNotification } from "@/hook";
import { useQueryMutation } from "@/redux/api/base";
import type { FormEditSemster } from "../form";



export const ModalForm: React.FC = () => {
  // state
  const {
    action,
    editModalForm,
    detailSemester,
    setEditModalForm,
    setDetailSemester,
    setAction,
    onReload,
  } = useContext<TypeManagerSemesterContext>(ManagerSemesterContext);

  const form = useForm<FormEditSemster>({
    initialValues: {
      name: "",
    },
    validate: {
      name: value => utils.validate.validateNull(value),
      start_time: (value, values) => validateStartTime(value, values),
      end_time: (value, values) => validateEndTime(value, values),
    }
  });

  const validateStartTime = (value: Date | undefined, values: FormEditSemster) => {
    if(!value && values.end_time) return "Yêu cầu phải điền thêm thời gian bắt đầu";
    if(value && !dayjs(value).isBefore(values.end_time)) return "Ngày bắt đầu phải trước ngày kết thúc"
    return null
  }

    const validateEndTime = (value: Date | undefined, values: FormEditSemster) => {
    if(!value && values.start_time) return "Yêu cầu phải điền thêm thời gian kết thúc";
    if(value && !dayjs(value).isAfter(values.start_time)) return "Ngày kết thúc phải sau ngày bắt đầu"
    return null
  }

  // hook
  const noti = useNotification();

  const actionName = useMemo(() => {
    let name = "";
    switch (action) {
      case "create":
        name = "Thêm mới kì học"
        break;
      case "update":
        name = "Chỉnh sửa kì học"
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
    setDetailSemester(null);
    setAction(null);
    form.reset();
  }

  const onSubmit = async (values: FormEditSemster) => {
    if (!action) throw "action invalid!";
    try {
      const result = await query({
        action,
        type: "one",
        modelName: "semesters",
        conditions: detailSemester ? { id: detailSemester.id } : {},
        data: {
          ...values,
          start_time: values.start_time ? dayjs(values.start_time).toISOString() : null,
          end_time: values.end_time ? dayjs(values.end_time).toISOString() : null,
          school_year_id: 1,
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
    if (!detailSemester) return;
    form.setValues({
      name: detailSemester.name,
      description: detailSemester.description,
      start_time: detailSemester.start_time,
      end_time: detailSemester.end_time,
    });
  }, [detailSemester]);



  return (
    <Modal
      opened={editModalForm}
      onClose={onClose}
      title={<TitleModal>{actionName}</TitleModal>}
      closeOnClickOutside={false}
    >
      <Stack gap={24}>
        <form id="form-semester" onSubmit={form.onSubmit(onSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Tên học kì"
                placeholder="Nhập tên học kì"
                required
                {...form.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <DatePickerInput
                label="Thời gian bắt đầu"
                placeholder="Nhập thời gian bắt đầu"
                valueFormat="DD/MM/YYYY"
                {...form.getInputProps("start_time")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <DatePickerInput
                label="Thời gian kết thúc"
                placeholder="Nhập thời gian kết thúc"
                valueFormat="DD/MM/YYYY"
                {...form.getInputProps("end_time")}
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
            form="form-semester"
            disabled={isLoading}
            loading={isLoading}
          >Xác nhận</Button>
        </Group>
      </Stack>
    </Modal>
  )
}