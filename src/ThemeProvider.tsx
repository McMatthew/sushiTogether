import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        primaryColor: "lime",
        colors: {
          gold: [
            "#3b2b00",
            "#574003",
            "#735503",
            "#8a680a",
            "#917013",
            "#b38917",
            "#d49f0f",
            "#ffbb00",
            "#ffcc40",
            "#ffdb78",
          ],
        },
        headings: {
          sizes: {
            h1: { fontSize: "36px" },
            h2: { fontSize: "30px" },
          },
        },
      }}
    >
      {children}
    </MantineProvider>
  );
};
export default ThemeProvider;
