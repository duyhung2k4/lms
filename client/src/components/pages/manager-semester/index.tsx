import React, { createContext, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { ActionIcon, Button, Group, Menu, Stack, Text, Tooltip } from "@mantine/core";
import {
  useMantineReactTable,
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "mantine-react-table";
import { IconDots, IconEdit, IconEye, IconPlus, IconReload, IconTrash } from "@tabler/icons-react";
import { useFilterQuery } from "@/redux/api/base";
import type { SemesterModel } from "@/models/semester";
import { ModalForm } from "./components";



const ManagerSemester: React.FC = () => {
  // stage
  const [editModalForm, setEditModalForm] = useState<boolean>(false);
  const [deleteModalForm, setDeleteModalForm] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [detailSemester, setDetailSemester] = useState<SemesterModel | null>(null);
  const [semesterSelect, setSemesterSelect] = useState<SemesterModel[]>([]);
  const [action, setAction] = useState<"create" | "update" | null>(null);



  // hook



  // api
  const {
    data,
    refetch,
    isFetching: loadingGetSemester,
  } = useFilterQuery({
    action: "read",
    type: "many",
    modelName: "semesters",
    conditions: {},
    data: {},
    orderBy: { name: "asc" },
  });
  const semesters = (data?.data || []) as SemesterModel[];



  // status
  const loading = loadingGetSemester;



  // other
  const columns = useMemo<MRT_ColumnDef<SemesterModel>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Tên học kì",
        size: 300,
      },
      {
        accessorKey: "start_time",
        header: "Thời gian bắt đầu",
        size: 200,
        Cell: (props) => {
          const semester = props.row.original;
          const time = semester.start_time ? dayjs(semester.start_time).format("DD/MM/YYYY") : ""
          return (
            <Text>{time}</Text>
          )
        }
      },
      {
        accessorKey: "end_time",
        header: "Thời gian kết thúc",
        size: 200,
        Cell: (props) => {
          const semester = props.row.original;
          const time = semester.end_time ? dayjs(semester.end_time).format("DD/MM/YYYY") : ""
          return (
            <Text>{time}</Text>
          )
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
          const item = props.row.original as SemesterModel;
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
    data: semesters,
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
          <Text>Số lượng khoa đã chọn: {semesters.length}</Text>
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

  const onEdit = (SemesterSelect: SemesterModel) => {
    setDetailSemester(SemesterSelect);
    setEditModalForm(true);
    setAction("update");
  }

  const onDelete = () => {
    setDeleteModalForm(true);
  }

  const onReload = () => {
    setRowSelection({});
    refetch();
  };



  // trigger
  useEffect(() => {
    const itemSelection = semesters.filter((item) => rowSelection[`${item.id}`]);
    setSemesterSelect(itemSelection);
  }, [rowSelection]);

  useEffect(() => {
    refetch();
  }, []);



  return (
    <ManagerSemesterContext.Provider
      value={{
        semesters,
        semesterSelect,
        editModalForm,
        deleteModalForm,
        detailSemester,
        action,
        setEditModalForm,
        setDeleteModalForm,
        setDetailSemester,
        setAction,
        onReload,
      }}
    >
      <Stack style={{ height: "100%", maxHeight: "100%" }}>
        <MantineReactTable
          table={table}
        />
      </Stack>
      <ModalForm/>
      {/* <ModalForm />
      <ModalDeleteSemester/> */}
    </ManagerSemesterContext.Provider>
  )
}

type ActionModal = "create" | "update" | null;

export type TypeManagerSemesterContext = {
  semesters: SemesterModel[]
  semesterSelect: SemesterModel[]
  editModalForm: boolean
  deleteModalForm: boolean,
  detailSemester: SemesterModel | null
  action: ActionModal,
  setAction: (_: ActionModal) => void,
  setEditModalForm: (_: boolean) => void
  setDeleteModalForm: (_: boolean) => void
  setDetailSemester: (_: SemesterModel | null) => void
  onReload: () => void
}

export const ManagerSemesterContext = createContext<TypeManagerSemesterContext>({
  semesters: [],
  semesterSelect: [],
  editModalForm: false,
  deleteModalForm: false,
  detailSemester: null,
  action: null,
  setEditModalForm: (_: boolean) => { },
  setDeleteModalForm: (_: boolean) => { },
  setDetailSemester: (_) => { },
  setAction: (_: ActionModal) => { },
  onReload: () => { },
});

export default ManagerSemester;