
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import { styled } from "@mui/material/styles";
import { DataGrid, GridCell } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { Box, Typography, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { GridActionsCellItem, GridEditInputCell, GridToolbarContainer, GridRowModes } from '@mui/x-data-grid-pro';

const StyledBox = styled(Box)(({ theme }) => ({
  height: 430,
  width: '65rem',
  padding: '5rem 2rem 2rem 2rem',
  '& .MuiDataGrid-columnHeaders': {
    color: '#a9a9a9',
    fontSize: '0.9rem',
    fontFamily: 'Fira Sans',
    fontWeight: 500,
    fontVariant: 'all-small-caps',
    lineHeight: '1.25rem',
    letterSpacing: "0.28px"
  },
  '& .MuiDataGrid-virtualScrollerRenderZone': {
    fontSize: '0.9rem',
    fontFamily: 'Inter',
    lineHeight: '1.5rem'
  },
  '& .MuiDataGrid-footerContainer ': {
    display: "none"
  },
  '& .MuiDataGrid-cell--textRight': {
    justifyContent: "flex-start"
  },
  '& input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: "none",
    margin: 0
  },
  ' .MuiDataGrid-cellContent': {
    fontSize: '1rem',
    fontFamily: 'Roboto'
  }

  // '& .MuiDataGrid-cell--editable': {
  //   backgroundColor: theme.palette.mode === 'dark' ? '#376331' : 'rgb(217 243 190)',
  //   '& .MuiInputBase-root': {
  //     height: '100%',
  //   },
  // },
  // '& .Mui-error': {
  //   backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
  //   color: theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f',
  // },
}));



const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

function NameEditInputCell(props) {
  const { error } = props;

  return (
    <StyledTooltip open={!!error} title={error}>
      <GridEditInputCell {...props} />
    </StyledTooltip>
  );
}

function renderEditName(params) {
  return <NameEditInputCell {...params} />;
}

export default function Vehicles({setEnableSubmit, enableSubmit}) {

  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([
    {
      id: 1,
      rego: '',
      vehicle_auth_ref: '',
      date_from: null,
      date_to: null
    },
    {
      id: 2,
      rego: '',
      vehicle_auth_ref: '',
      date_from: null,
      date_to: null
    },
    {
      id: 3,
      rego: '',
      vehicle_auth_ref: '',
      date_from: null,
      date_to: null
    },
    {
      id: 4,
      rego: '',
      vehicle_auth_ref: '',
      date_from: null,
      date_to: null
    },
    {
      id: 5,
      rego: '',
      vehicle_auth_ref: '',
      date_from: null,
      date_to: null
    },
  ])

  const remove = (id) => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { rego: "", vehicle_auth_ref: "", id, date_from: null, date_to: null }
      }
      return row;
    });
    setRows(newRows)
  }

  function validateName(rego, params) {
    const regex = /^(?:[A-Z0-9]{1,7})?$/;
    const isValidRego = regex.test(rego.toUpperCase());
    if (isValidRego) {
      setEnableSubmit({
        ...enableSubmit,
        [params.id]: true
      });
      return null;
    }
    setEnableSubmit({
      ...enableSubmit,
      [params.id]: false
    });
    return  'Please check that the value is 1-7 characters long and contains only characters A-Z or numbers 0-9.';
  }

  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    // Find the index of the row that was edited
    const rowIndex = rows.findIndex((row) => row.id === updatedRow.id);

    // Replace the old row with the updated row
    const updatedRows = [...rows];
    updatedRows[rowIndex] = updatedRow;

    // Update the state with the new rows
    setRows(updatedRows);

    // Return the updated row to update the internal state of the DataGrid
    return updatedRow;
  }

  const dateFormat = (data) => {
    return data
      .filter(datum => {
        const { rego, vehicle_auth_ref, date_from, date_to } = datum;

        return [rego, vehicle_auth_ref].some(item => item !== '') || [date_from, date_to].some(item => item !== null)
      })
      .map(datum => ({
        vehicle_rego: datum?.rego,
        vehicle_auth_ref: datum?.vehicle_auth_ref,
        vehicle_start_date: datum?.date_from ? dayjs(datum.date_from).format('DD/MM/YYYY') : '',
        vehicle_end_date: datum?.date_to ? dayjs(datum.date_to).format('DD/MM/YYYY') : ''
      }))
  }

  const columns = [
    {
      field: 'rego',
      headerName: 'VEHICLE REGISTRATION NUMBER',
      width: 220,
      editable: true,
      valueFormatter: ({ value }) => value.toUpperCase(),
      preProcessEditCellProps: (params) => {

        const errorMessage = validateName(params?.props?.value?.toString(), params);
        return { ...params.props, error: errorMessage };
      },
      renderEditCell: renderEditName,
    },
    {
      field: 'vehicle_auth_ref',
      headerName: 'VEHICLE SERVICE LICENCE NUMBER',
      width: 230,
      editable: true,
      type: "number",
      valueParser: (value) => {
        return value.toString()
      },
      valueFormatter: ({ value }) => value
    },
    {
      field: 'date_from',
      headerName: 'START DATE OF AVAILABILITY',
      width: 220,
      editable: true,
      type: "date",

    },
    {
      field: 'date_to',
      headerName: 'END DATE OF AVAILABILITY',
      width: 180,
      editable: true,
      type: "date",
    },
    {
      field: 'action',
      headerName: 'ACTIONS',
      width: 100,
      editable: true,
      // preProcessEditCellProps,
      renderEditCell: renderEditName,
      type: 'actions',
      getActions: (props) => {

        return [props?.row?.rego, props?.row?.vehicle_auth_ref, props?.row?.date_from, props?.row?.date_TO].every(str => !str) ?
          [] : [<GridActionsCellItem
            icon={<DeleteIcon sx={{ color: "#a9a9a9" }} />}
            label="Delete"
            // onClick={handleDeleteClick(id)}
            color="inherit"
            onClick={() => remove(props.row.id)}
          />]
      }
    },
  ];

  return {
    payload: dateFormat(rows),
    render:
      <StyledBox>
        <Typography
          sx={{
            fontFamily: "Fira Sans, sans-serif",
            fontWeight: 500,
            lineHeight: "2.5rem",
            fontSize: "1.25rem",
            letterSpacing: "-0.4px",
            marginBottom: "1.5rem",
            marginTop: "4rem"
          }}
        >
          Affiliated Vehicles
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="cell"
          disableRowSelectionOnClick
          hideFooterPagination={true}
          processRowUpdate={(a, b) => handleProcessRowUpdate(a, b)}
          slots={{
            //     toolbar: EditToolbar,
            cell: CustomCell
          }}
        // slotProps={{
        //   toolbar: { setRows, setRowModesModel },
        // }}
        //    isCellEditable={(params) => params.row.id === 5}
        />
      </StyledBox>
  }
};

const CustomCell = (props) => {
  const { children, ...rest } = props;
  return (
    <GridCell {...rest}>
      {rest.cellMode === 'edit' || ((rest.value !== null && rest.value !== '') || !['date_from', 'date_to'].includes(rest.field))
        ? children
        :
        <Typography
          sx={{
            color: "#9ca3af",
            fontFamily: "Fira Sans, sans-serif",
            lineHeight: '1.5rem'
          }}
        >
          DD/MM/YYYY
        </Typography>
      }
    </GridCell>
  );
}

