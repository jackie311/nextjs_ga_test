
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';

import { Mandatory, FieldTitle } from "./style";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const style = {
  margin: '1rem 0',
  "& .datepicker": {
    width: '30rem',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    boxShadow: ' 0px 1px 2px rgba(16, 24, 40, 0.05)',
  }
};;

export default function DateSelect(props) {
  const {
    title,
    value,
    setValue,
    requiredField
  } = props

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={style}>
        <FieldTitle>
          {title} {requiredField && <Mandatory>*</Mandatory>}
        </FieldTitle>
        <DesktopDatePicker
          className='datepicker'
          value={value}
         inputFormat={"DD/MM/YYYY"}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
  );
}