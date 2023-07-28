import { Box } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { Mandatory, FieldTitle } from "./style";

const theme = createTheme({
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          "&> .Mui-disabled": {
            backgroundColor: "#F3F4F6",
            
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "42px",
          fontFamily: [ "Roboto", "Arial", "sans-serif"].join(","),
          "& .Mui-disabled": {
            WebkitTextFillColor: "#111827 !important",
          },
          "& > input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none",
          },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: "42px",
          fontFamily: [ "Roboto", "Arial", "sans-serif"].join(","),
          border: "1px solid #D1D5DB",
          boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
          borderRadius: "6px",
          "& .Mui-disabled": {
            WebkitTextFillColor: "#111827 !important",
          },
          "& > input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none",
          },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        },
      },
    },
  },
});

export default function CommonInput(props) {
  const {
    Icon,
    title,
    style,
    adornment,
    iconPosition,
    errorMessage,
    requiredField = false,
    ...rest } = props;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ margin: '2rem 0', ...style }}>
        {title && <FieldTitle>
          {title} {requiredField && <Mandatory>*</Mandatory>}
        </FieldTitle>}

        {(Icon && iconPosition === 'end') && <FormControl variant="filled" sx={{ width: '30rem' }}>
          <OutlinedInput
            {...rest}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                >
                  {<Icon />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>}

        {(!Icon && iconPosition && iconPosition === 'start') && <FormControl variant="filled" sx={{ width: '30rem' }}>
          <OutlinedInput
            {...rest}
            startAdornment={<InputAdornment sx={{ marginTop: '0px !important' }} position="start">{adornment}</InputAdornment>}
          />
        </FormControl>}

        {(!Icon && iconPosition && iconPosition === 'end') && <FormControl variant="filled" sx={{ width: '30rem' }}>
          <OutlinedInput
            {...rest}
            endAdornment={<InputAdornment sx={{ marginTop: '0px !important' }} position="end">{adornment}</InputAdornment>}
          />
        </FormControl>}

        {!iconPosition && <FormControl variant="filled" sx={{ width: '30rem' }}>
          <OutlinedInput
            {...rest}
          />
        </FormControl>}
      </Box>
    </ThemeProvider>
  );
}
