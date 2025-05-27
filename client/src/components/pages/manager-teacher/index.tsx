import React, { createContext, useMemo, useState } from "react";
import { ActionIcon, Badge, Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import {
  useMantineReactTable,
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "mantine-react-table";
import { IconDots, IconPlus, IconReload, IconTrash } from "@tabler/icons-react";
import { useFilterQuery } from "@/redux/api/base";
import { ModalEditTeacher } from "./components";
import type { ProfileModel } from "@/models/profile";



const ManagerTeacher: React.FC = () => {
  // stage
  const [editModalForm, setEditModalForm] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  // api
  const {
    data,
    refetch,
    isFetching: loadingGetTeacher,
  } = useFilterQuery({
    action: "read",
    type: "many",
    modelName: "profiles",
    conditions: {},
    data: {},
    include: {
      profile_departments: {
        include: {
          department: true,
        }
      }
    }
  });

  const items = useMemo(() => {
    return (data?.data || []) as ProfileModel[];
  }, [data]);

  // other
  const columns = useMemo<MRT_ColumnDef<ProfileModel>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Tên giáo viên",
        size: 300,
        Cell: (props) => {
          const item = props.row.original as ProfileModel;
          return (
            <Text>{item.last_name} {item.first_name}</Text>
          )
        }
      },
      {
        accessorKey: "lms_code",
        header: "Mã LMS",
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 300,
      },
      {
        accessorKey: "phone",
        header: "Số điện thoại",
        size: 300,
      },
      {
        accessorKey: "departments",
        header: "Khoa trực thuộc",
        size: 400,
        Cell: (props) => {
          const profile = props.row.original;
          return (
            <Group>
              {profile.profile_departments.map(item =>
                <Badge
                  key={item.id}
                  variant="outline"
                >{item.department?.name}</Badge>
              )}
            </Group>
          )
        }
      },
      {
        accessorKey: "action",
        header: "Tác vụ",
        size: 78,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
        enableEditing: false,
        Cell: (_) => {
          return (
            <Tooltip label="Tác vụ">
              <Group
                w={"100%"}
                align="center"
                justify="center"
                style={{ cursor: "pointer" }}
              >
                <IconDots />
              </Group>
            </Tooltip>
          )
        }
      }
    ]
  }, []);

  const table = useMantineReactTable({
    columns,
    data: items,
    initialState: {
      columnPinning: {
        right: ["action"],
      }
    },
    state: {
      rowSelection,
      isLoading: loadingGetTeacher,
    },
    layoutMode: "grid",
    mantinePaperProps: {
      style: {
        height: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }
    },
    mantineTableContainerProps: {
      style: {
        flex: 1,
      }
    },
    enableColumnPinning: true,
    enableRowSelection: true,
    enableStickyHeader: true,
    enableDensityToggle: true,
    onRowSelectionChange: setRowSelection,
    renderToolbarAlertBannerContent: (_) => {
      const itemSelection = items.filter((_, index) => rowSelection[`${index}`]);
      return (
        <Group align="center">
          <Text>Số lượng khoa đã chọn: {itemSelection.length}</Text>
          <Tooltip label="Xóa">
            <ActionIcon
              variant="filled"
              p={4}
              color="red"
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      )
    },
    renderTopToolbarCustomActions: () => {
      return (
        <Group>
          <Button
            color="primary"
            onClick={onCreate}
            leftSection={<IconPlus size={18} />}
          >Thêm mới</Button>
          <Button
            color="primary"
            variant="outline"
            onClick={onReload}
            leftSection={<IconReload size={18} />}
          >Tải lại</Button>
        </Group>
      )
    }
  });



  // action
  const onCreate = () => {
    setEditModalForm(true);
  }

  const onReload = () => refetch();



  // trigger



  return (
    <ManagerTeacherContext.Provider
      value={{
        editModalForm,
        setEditModalForm,
        onReload,
      }}
    >
      <Stack style={{ height: "100%", maxHeight: "100%" }}>
        <MantineReactTable
          table={table}
        />
      </Stack>
      <ModalEditTeacher />
    </ManagerTeacherContext.Provider>
  )
}

export type TypeManagerTeacherContext = {
  editModalForm: boolean
  setEditModalForm: (_: boolean) => void
  onReload: () => void
}

export const ManagerTeacherContext = createContext<TypeManagerTeacherContext>({
  editModalForm: false,
  setEditModalForm: (_: boolean) => { },
  onReload: () => { },
});

export default ManagerTeacher;