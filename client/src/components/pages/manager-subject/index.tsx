import React, { createContext, useEffect, useMemo, useState } from "react";
import { ActionIcon, Badge, Button, Group, Menu, Select, Stack, Text, Tooltip } from "@mantine/core";
import {
  useMantineReactTable,
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "mantine-react-table";
import { IconDots, IconEdit, IconEye, IconPlus, IconReload, IconTrash } from "@tabler/icons-react";
import { useFilterQuery } from "@/redux/api/base";
import { ModalForm } from "./components/modal_form";
import { useNavigate } from "react-router";
import { ROUTER } from "@/constants/routes";
import type { SubjectModel } from "@/models/subject";
import type { SemesterModel } from "@/models/semester";



const ManagerSubject: React.FC = () => {
  // stage
  const [editModalForm, setEditModalForm] = useState<boolean>(false);
  const [deleteModalForm, setDeleteModalForm] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [detailSubject, setDetailSubject] = useState<SubjectModel | null>(null);
  const [subjectSelect, setSubjectSelect] = useState<SubjectModel[]>([]);
  const [semesterSelect, setSemesterSelect] = useState<SemesterModel | null>(null);
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
      section_class: true,
    },
    orderBy: { name: "asc" },
  });
  const subjects = (data?.data || []) as SubjectModel[];

  const {
    data: dataSemester,
    refetch: refetchSemester,
    isFetching: loadingGetSemester,
  } = useFilterQuery({
    action: "read",
    type: "many",
    modelName: "semesters",
    conditions: {},
    data: {},
    include: {},
    orderBy: { name: "asc" },
  });
  const semesters = (dataSemester?.data || []) as SemesterModel[];



  // status
  const loading = loadingGetSubject || loadingGetSemester;



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
        accessorKey: "count_section_class",
        header: "Số lớp mở",
        size: 180,
        Cell: (props) => {
          const subject = props.row.original;
          const setionClassOfSemester = (subject.section_class || []).filter(item =>
            item.semester_id === semesterSelect?.id
          );
          return (
            <Text>{setionClassOfSemester.length}</Text>
          )
        }
      },
      {
        accessorKey: "count_section_class_add_teacher",
        header: "Số lớp đã phân công",
        size: 220,
        Cell: (props) => {
          const subject = props.row.original;
          const setionClassOfSemester = (subject.section_class || []).filter(item =>
            item.semester_id === semesterSelect?.id
          );
          const setionClassOfSemesterAddTeacher = setionClassOfSemester.filter(item => item.teacher_id);
          return (
            <Text>{setionClassOfSemesterAddTeacher.length}/{setionClassOfSemester.length}</Text>
          )
        }
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
  }, [semesterSelect]);

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
          <Select
            data={
              semesters.map(item => ({
                label: item.name,
                value: `${item.id}`,
              }))
            }
            value={semesterSelect ? `${semesterSelect.id}` : undefined}
            onChange={e => {
              const itemSelect = semesters.find(item => `${item.id}` === e);
              setSemesterSelect(itemSelect || null);
            }}
          />
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
    refetch();
    refetchSemester();
    setRowSelection({});
  };



  // trigger
  useEffect(() => {
    const itemSelection = subjects.filter((item) => rowSelection[`${item.id}`]);
    setSubjectSelect(itemSelection);
  }, [rowSelection]);

  useEffect(() => {
    refetch();
    refetchSemester();
  }, []);

  useEffect(() => {
    if (semesters.length > 0) {
      setSemesterSelect(semesters[0]);
    }
  }, [semesters]);



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
      <ModalForm />
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