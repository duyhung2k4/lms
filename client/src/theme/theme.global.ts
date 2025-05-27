import { createTheme, type CSSProperties } from "@mantine/core";

const themeGlobal = createTheme({
  colors: {
    primary: ["#6E54B5", "#6E54B5", "#6E54B5", "#6E54B5", "#6E54B5", "#6E54B5", "#6E54B5", "#6E54B5", "#6E54B5", "#6E54B5"]
  },
  primaryColor: "primary",
  components: {
    Button: {
      styles: {
        section: {
          margin: 4,
        } as CSSProperties,
        label: {
          fontWeight: 400
        } as CSSProperties,
      }
    },
    Text: {
      styles: {
        root: {
          color: "#FFF",
        } as CSSProperties,
      }
    },
    Badge: {
      styles: {
        root: {
          borderRadius: 4,
        } as CSSProperties,
      }
    },
    Pill: {
      styles: {
        root: {
          borderRadius: 4,
        } as CSSProperties,
      }
    },
  },
});

export default themeGlobal;