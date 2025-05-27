import React from "react";
import { MantineProvider } from "@mantine/core";


export type ThemeTableProps = {
  children: React.ReactNode
}
const ThemeTable: React.FC<ThemeTableProps> = (props) => {
  return (
    <MantineProvider
      defaultColorScheme="dark"
    >{props.children}</MantineProvider>
  )
}

export default ThemeTable;