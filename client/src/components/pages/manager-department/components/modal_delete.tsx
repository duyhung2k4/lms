import React, { useContext } from "react";
import TitleModal from "@/components/shared/title/modal.title";
import { Badge, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { ManagerDepartmentContext, type TypeManagerDepartmentContext } from "..";
import { useQueryMutation } from "@/redux/api/base";
import { useNotification } from "@/hook";



export const ModalDeleteDepartment: React.FC = () => {
  // hook
  const {
    deleteModalForm,
    departmentSelect,
    setDeleteModalForm,
    onReload,
  } = useContext<TypeManagerDepartmentContext>(ManagerDepartmentContext);

  const noti = useNotification();



  // api
  const [query, { isLoading }] = useQueryMutation();

  const handleDelete = async () => {
    try {
      const result = await query({
        action: "delete",
        type: "many",
        modelName: "departments",
        conditions: {
          id: { in: departmentSelect.map(item => item.id) },
        },
        data: {},
      });

      if (result.error) throw "Xóa thất bại!";
      onClose();
      onReload();
      noti.success("Xóa thành công!");
    } catch (error) {
      noti.faild(`${error}`);
    }
  }



  // action
  const onClose = () => {
    if (isLoading) return;
    setDeleteModalForm(false);
  }



  return (
    <Modal
      opened={deleteModalForm}
      onClose={onClose}
      title={<TitleModal>Xóa thông tin khoa</TitleModal>}
      closeOnClickOutside={false}
    >
      <Stack>
        <Text>Tác vụ không thể hoàn tác</Text>
        <Group>
          {departmentSelect.map(item =>
            <Badge
              key={item.id}
              variant="outline"
              style={{ borderRadius: 4 }}
            >{item.name}-{item.code}</Badge>
          )}
        </Group>
        <Group w={"100%"} justify="end">
          <Button
            disabled={isLoading}
            loading={isLoading}
            onClick={handleDelete}
          >Xác nhận</Button>
        </Group>
      </Stack>
    </Modal>
  )
}