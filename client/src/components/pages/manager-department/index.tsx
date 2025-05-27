import React, { createContext, useEffect, useMemo, useState } from "react";
import { ActionIcon, Button, Group, Menu, Stack, Text, Tooltip } from "@mantine/core";
import {
  useMantineReactTable,
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "mantine-react-table";
import { IconDots, IconEdit, IconEye, IconPlus, IconReload, IconTrash } from "@tabler/icons-react";
import { useFilterQuery } from "@/redux/api/base";
import { ModalDeleteDepartment, ModalForm } from "./components";
import { useAppDispatch } from "@/redux/hook";
import type { DepartmentModel } from "@/models/department";
import { getAllDepartment } from "@/redux/slice/constant.slice";
import type { ProfileModel } from "@/models/profile";



const ManagerDepartment: React.FC = () => {
  // stage
  const [editModalForm, setEditModalForm] = useState<boolean>(false);
  const [deleteModalForm, setDeleteModalForm] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [detailDepartment, setDetailDepartment] = useState<DepartmentModel | null>(null);
  const [departmentSelect, setDepartmentSelect] = useState<DepartmentModel[]>([]);
  const [action, setAction] = useState<"create" | "update" | null>(null);

  // hook
  const dispatch = useAppDispatch();

  // api
  const {
    data,
    refetch,
    isFetching: loadingGetDepartment,
  } = useFilterQuery({
    action: "read",
    type: "many",
    modelName: "departments",
    conditions: {},
    data: {},
    include: {
      owner: true,
    },
    orderBy: { name: "asc" },
  });
  const departments = (data?.data || []) as DepartmentModel[];

  const {
    data: dataProfile,
    refetch: refetchProfile,
    isFetching: loadingGetProfile,
  } = useFilterQuery({
    modelName: "profiles",
    data: {},
    conditions: {},
    type: "many",
    action: "read",
    orderBy: { 
      first_name: "asc",
    },
  });
  const profiles = (dataProfile?.data || []) as ProfileModel[];


  // status
  const loading = loadingGetDepartment || loadingGetProfile;

  

  // other
  const columns = useMemo<MRT_ColumnDef<DepartmentModel>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Tên khoa",
        size: 300,
      },
      {
        accessorKey: "code",
        header: "Mã khoa",
        size: 200,
      },
      {
        accessorKey: "manager",
        header: "Người quản lí",
        size: 300,
        Cell: (props) => {
          const department = props.row.original;
          return <Text>{department.owner?.last_name} {department.owner?.first_name}</Text>
        }
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        size: 500,
      },
      {
        accessorKey: "action",
        header: "Tác vụ",
        size: 78,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
        enableEditing: false,
        Cell: (props) => {
          const item = props.row.original as DepartmentModel;
          return (
            <Tooltip label="Tác vụ">
              <Menu>
                <Menu.Target>
                  <Group
                    w={"100%"}
                    align="center"
                    justify="center"
                    style={{ cursor: "pointer" }}
                  >
                    <IconDots />
                  </Group>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconEye size={20} />}>
                    Xem chi tiết
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconEdit size={20} />}
                    onClick={() => onEdit(item)}
                  >
                    Chỉnh sửa
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Tooltip>
          )
        }
      }
    ]
  }, []);

  const table = useMantineReactTable({
    columns,
    data: departments,
    initialState: {
      columnPinning: {
        right: ["action"],
      }
    },
    state: {
      rowSelection,
      isLoading: loading,
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
    getRowId: (props) => `${props.id}`,
    onRowSelectionChange: setRowSelection,
    renderToolbarAlertBannerContent: (_) => {
      return (
        <Group align="center">
          <Text>Số lượng khoa đã chọn: {departmentSelect.length}</Text>
          <Tooltip label="Xóa">
            <ActionIcon
              variant="filled"
              p={4}
              color="red"
              onClick={onDelete}
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
    setAction("create");
  }

  const onEdit = (departmentSelect: DepartmentModel) => {
    setDetailDepartment(departmentSelect);
    setEditModalForm(true);
    setAction("update");
  }

  const onDelete = () => {
    setDeleteModalForm(true);
  }

  const onReload = () => {
    setRowSelection({});
    refetch();
    refetchProfile();
  };



  // trigger
  useEffect(() => {
    const itemSelection = departments.filter((item) => rowSelection[`${item.id}`]);
    setDepartmentSelect(itemSelection);
  }, [rowSelection]);

  useEffect(() => {
    dispatch(getAllDepartment(departments));
  }, [departments]);

  useEffect(() => {
    refetchProfile();
    refetch();
  }, []);



  return (
    <ManagerDepartmentContext.Provider
      value={{
        departments,
        profiles,
        departmentSelect,
        editModalForm,
        deleteModalForm, 
        detailDepartment,
        action,
        setEditModalForm,
        setDeleteModalForm,
        setDetailDepartment,
        setAction,
        onReload,
      }}
    >
      <Stack style={{ height: "100%", maxHeight: "100%" }}>
        <MantineReactTable
          table={table}
        />
      </Stack>
      <ModalForm />
      <ModalDeleteDepartment/>
    </ManagerDepartmentContext.Provider>
  )
}

type ActionModal = "create" | "update" | null;

export type TypeManagerDepartmentContext = {
  departments: DepartmentModel[]
  profiles: ProfileModel[]
  departmentSelect: DepartmentModel[]
  editModalForm: boolean
  deleteModalForm: boolean, 
  detailDepartment: DepartmentModel | null
  action: ActionModal,
  setAction: (_: ActionModal) => void,
  setEditModalForm: (_: boolean) => void
  setDeleteModalForm: (_: boolean) => void
  setDetailDepartment: (_: DepartmentModel | null) => void
  onReload: () => void
}

export const ManagerDepartmentContext = createContext<TypeManagerDepartmentContext>({
  departments: [],
  profiles: [],
  departmentSelect: [],
  editModalForm: false,
  deleteModalForm: false, 
  detailDepartment: null,
  action: null,
  setEditModalForm: (_: boolean) => { },
  setDeleteModalForm: (_: boolean) => { },
  setDetailDepartment: (_) => { },
  setAction: (_: ActionModal) => { },
  onReload: () => { },
});

export default ManagerDepartment;