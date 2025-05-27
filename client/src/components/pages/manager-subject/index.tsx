import React, { createContext, useEffect, useMemo, useState } from "react";
import { ActionIcon, Badge, Button, Group, Menu, Stack, Text, Tooltip } from "@mantine/core";
import {
  useMantineReactTable,
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "mantine-react-table";
import { IconDots, IconEdit, IconEye, IconPlus, IconReload, IconTrash } from "@tabler/icons-react";
import { useFilterQuery } from "@/redux/api/base";
import { ModalForm } from "./components/modal_form";
import type { SubjectModel } from "@/models/subject";
import { useNavigate } from "react-router";
import { ROUTER } from "@/constants/routes";



const ManagerSubject: React.FC = () => {
  // stage
  const [editModalForm, setEditModalForm] = useState<boolean>(false);
  const [deleteModalForm, setDeleteModalForm] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [detailSubject, setDetailSubject] = useState<SubjectModel | null>(null);
  const [subjectSelect, setSubjectSelect] = useState<SubjectModel[]>([]);
  const [action, setAction] = useState<"create" | "update" | null>(null);



  // hook
  const navigate = useNavigate();



  // api
  const {
    data,
    refetch,
    isFetching: loadingGetSubject,
  } = useFilterQuery({
    action: "read",
    type: "many",
    modelName: "subjects",
    conditions: {},
    data: {},
    include: {
      department: true,
    },
    orderBy: { name: "asc" },
  });
  const subjects = (data?.data || []) as SubjectModel[];



  // status
  const loading = loadingGetSubject;



  // other
  const columns = useMemo<MRT_ColumnDef<SubjectModel>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Tên môn học",
        size: 300,
      },
      {
        accessorKey: "code",
        header: "Mã môn học",
        size: 180,
      },
      {
        accessorKey: "number_of_credit",
        header: "Số tín chỉ",
        size: 180,
      },
      {
        accessorKey: "number_of_lessons",
        header: "Số tiết học",
        size: 180,
      },
      {
        accessorKey: "unit",
        header: "Giá tín chỉ",
        size: 180,
      },
      {
        accessorKey: "department_id",
        header: "Khoa quản lí",
        size: 300,
        Cell: (props) => {
          const subject = props.row.original;
          return (
            <Badge variant="outline">{subject.department?.name}</Badge>
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
          const item = props.row.original as SubjectModel;
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
                  <Menu.Item 
                    leftSection={<IconEye size={20} />}
                    onClick={() => onDetail(item.code)}
                  >
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
    data: subjects,
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
    enableDensityToggle: false,
    getRowId: (props) => `${props.id}`,
    onRowSelectionChange: setRowSelection,
    renderToolbarAlertBannerContent: (_) => {
      return (
        <Group align="center">
          <Text>Số lượng khoa đã chọn: {subjects.length}</Text>
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

  const onDetail = (code: string) => {
    navigate(`${ROUTER.MANAGER_SUBJECT.href}/${code}`);
  }

  const onEdit = (SubjectSelect: SubjectModel) => {
    setDetailSubject(SubjectSelect);
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
    const itemSelection = subjects.filter((item) => rowSelection[`${item.id}`]);
    setSubjectSelect(itemSelection);
  }, [rowSelection]);

  useEffect(() => {
    refetch();
  }, []);



  return (
    <ManagerSubjectContext.Provider
      value={{
        subjects,
        subjectSelect,
        editModalForm,
        deleteModalForm,
        detailSubject,
        action,
        setEditModalForm,
        setDeleteModalForm,
        setDetailSubject,
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
    </ManagerSubjectContext.Provider>
  )
}

type ActionModal = "create" | "update" | null;

export type TypeManagerSubjectContext = {
  subjects: SubjectModel[]
  subjectSelect: SubjectModel[]
  editModalForm: boolean
  deleteModalForm: boolean,
  detailSubject: SubjectModel | null
  action: ActionModal,
  setAction: (_: ActionModal) => void,
  setEditModalForm: (_: boolean) => void
  setDeleteModalForm: (_: boolean) => void
  setDetailSubject: (_: SubjectModel | null) => void
  onReload: () => void
}

export const ManagerSubjectContext = createContext<TypeManagerSubjectContext>({
  subjects: [],
  subjectSelect: [],
  editModalForm: false,
  deleteModalForm: false,
  detailSubject: null,
  action: null,
  setEditModalForm: (_: boolean) => { },
  setDeleteModalForm: (_: boolean) => { },
  setDetailSubject: (_) => { },
  setAction: (_: ActionModal) => { },
  onReload: () => { },
});

export default ManagerSubject;