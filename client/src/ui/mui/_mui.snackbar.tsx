import { createTheme, Snackbar, ThemeProvider } from "@mui/material";
import { SnackbarType } from "../../types";
import { constant } from "../../constants/constant";

type Props = {
  state: SnackbarType;
  setState: React.Dispatch<React.SetStateAction<SnackbarType>>;
  vertical?: "top" | "bottom";
  horizontal?: "left" | "center" | "right";
  hideDuraration?: number;
};

export default function MuiSnackbar({
  state,
  setState,
  vertical = "top",
  horizontal = "center",
  hideDuraration = 6000,
}: Props) {
  const theme = createTheme({
    typography: {
      fontSize: 16,
    },
    palette: {
      primary: {
        main: state.color ?? "",
      },
    },
    components: {
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            color: state.color ?? constant.COLORS.FONT_POPUP,
            backgroundColor: constant.COLORS.POPUP,
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        message={state.message}
        open={state.trigger}
        autoHideDuration={hideDuraration}
        onClose={() => {
          setState({ ...state, trigger: false });
        }}
        anchorOrigin={{ vertical, horizontal }}
      />
    </ThemeProvider>
  );
}
