import { Text } from "@mantine/core";
import React from "react";


export type TitleModalProps = {
  children: React.ReactNode
}
const TitleModal: React.FC<TitleModalProps> = ({ children }) => {
  return (
    <Text
      style={{
        textTransform: "uppercase",
        fontWeight: 500,
        fontSize: 20,
      }}
    >
      {children}
    </Text>
  )
}

export default TitleModal;