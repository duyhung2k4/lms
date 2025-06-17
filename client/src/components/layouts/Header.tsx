import React from "react";
import { SIZE } from "@/constants/size";
import { Group } from "@mantine/core";


const HeaderTop: React.FC = () => {
  return (
    <Group
      style={{
        height: SIZE.h_header,
        backgroundColor: "#0C0C0C",
        padding: 8,
      }}
    ></Group>
  );
};

export default HeaderTop;
