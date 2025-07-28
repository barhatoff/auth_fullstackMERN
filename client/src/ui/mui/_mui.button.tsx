import { Button, ThemeProvider, createTheme } from "@mui/material";

type Props = {
  title: string;
  event: () => void;
  color?: string;
  width?: string;
  height?: string;
  margin?: string;
};

export default function MuiButton({
  title,
  event,
  color = "#FFFFFF",
  width = "30%",
  height = "5rem",
  margin,
}: Props) {
  const theme = createTheme({
    typography: {
      fontFamily: `"Montserrat", sans-serif`,
      fontSize: 20,
    },
    palette: {
      primary: {
        main: color,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            margin,
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Button
        type="submit"
        variant="outlined"
        onClick={() => event()}
        style={{ width, height }}
      >
        {title}
      </Button>
    </ThemeProvider>
  );
}
