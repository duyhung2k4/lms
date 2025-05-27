import { SIZE } from "@/constants/size";
import { Group } from "@mantine/core";
import React from "react";



const HeaderTop: React.FC = () => {
  return (
    <Group
      style={{
        height: SIZE.h_header,
        backgroundColor: "#0C0C0C",
      }}
    ></Group>
  )
}

export default HeaderTop;