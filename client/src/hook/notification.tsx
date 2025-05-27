import { notifications } from "@mantine/notifications";



export const useNotification = () => {
  return {
    success: (message: string) => notifications.show({
      title: "Thành công",
      message,
      autoClose: 2000,
      color: "green",
      position: "top-right",
    }),
    warning: (message: string) => notifications.show({
      title: "Cảnh báo",
      message,
      autoClose: false,
      color: "yellow",
      position: "top-right",
    }),
    faild: (message: string) => notifications.show({
      title: "Thất bại",
      message,
      autoClose: false,
      color: "red",
      position: "top-right",
    }),
  };
};