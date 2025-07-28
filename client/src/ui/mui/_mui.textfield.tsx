import { TextField, ThemeProvider, createTheme } from "@mui/material";

type Props = {
  label: string;
  state: string | null;
  setState: React.Dispatch<React.SetStateAction<string | null>>;
  error?: boolean;
  helperText?: string | null;
  type?: string;
  color?: string;
  labelColor?: string;
  width?: string;
  margin?: string;
  fontSize?: number;
};
export default function MuiTextfield({
  label,
  state,
  setState,
  error,
  helperText,
  type = "text",
  color = "#FFF",
  labelColor = "#5A5A5A",
  width = "95%",
  margin,
  fontSize = 20,
}: Props) {
  const theme = createTheme({
    typography: {
      //fontFamily: `"Montserrat", sans-serif`,
      fontSize,
    },
    palette: {
      text: {
        primary: color,
        secondary: color,
        disabled: color,
      },
      primary: {
        main: color,
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              "& legend": {
                width: "100%",
              },
              "& span": {
                fontSize: "0.875rem",
              },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <TextField
        type={type}
        error={error}
        helperText={helperText}
        label={label}
        value={state}
        onChange={(e) => setState(e.target.value)}
        sx={{
          width: { width },
          label: { color: labelColor },
          margin: { margin },
        }}
        slotProps={
          state
            ? {
                inputLabel: { shrink: !!state },
              }
            : {}
        }
      />
    </ThemeProvider>
  );
}
