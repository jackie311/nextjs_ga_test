
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

const StyledBox = styled(Box)(() => ({
  height: 366,
  width: '47rem',
  padding: '1rem 2rem 2rem 2rem',
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
    lineHeight: '1.5rem',
    fontWeight: '300'
  },
  '& .MuiDataGrid-cell--textRight': {
    justifyContent: "flex-start"
  },
  '& input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: "none",
    margin: 0
  },
  '& .MuiDataGrid-footerContainer ': {
    display: "none"
  },
  ' .MuiDataGrid-cellContent': {
    fontSize: '1rem',
    fontFamily: 'Roboto'
  }
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

export default function Drivers() {

  const preProcessEditCellProps = async (params) => {
    const errorMessage = await validateName(params?.props?.value?.toString());
    return { ...params.props, error: errorMessage };
  };
  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([
    {
      id: 1,
      driver_auth_ref: '',
      start_date: null,
      end_date: null
    },
    {
      id: 2,
      driver_auth_ref: '',
      start_date: null,
      end_date: null
    },
    {
      id: 3,
      driver_auth_ref: '',
      start_date: null,
      end_date: null
    },
    {
      id: 4,
      driver_auth_ref: '',
      start_date: null,
      end_date: null
    },
    {
      id: 5,
      driver_auth_ref: '',
      start_date: null,
      end_date: null
    },
  ])

  const columns = [
    {
      field: 'driver_auth_ref',
      headerName: 'DRIVER AUTHORISATION NUMBER',
      width: 220,
      editable: true,
      type: 'number',
      valueParser: (value) => {
        return value.toString()
      },
      valueFormatter: ({ value }) => value

    },
    {
      field: 'start_date',
      type: "date",
      headerName: 'START DATE OF AFFILIATION',
      width: 180,
      editable: true,
      //  preProcessEditCellProps,
      //  renderEditCell: renderEditName,
    },
    {
      field: 'end_date',
      type: "date",
      headerName: 'END DATE OF AFFILIATION',
      width: 180,
      editable: true,
      //   preProcessEditCellProps,
      // renderEditCell: renderEditName,
    },
    {
      field: 'action',
      headerName: 'ACTIONS',
      width: 100,
      editable: true,
      //  preProcessEditCellProps,
      renderEditCell: renderEditName,
      type: 'actions',
      getActions: (props) => {

        return [props?.row?.driver_auth_ref, props?.row?.start, props?.row?.end_date].every(str => !str) ?
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

  const remove = (id) => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { driver_auth_ref: "", start_date: null, id, end_date: null }
      }
      return row;
    });
    setRows(newRows)
  }

  let promiseTimeout;
  function validateName(username) {
    const existingUsers = rows.map((row) => row.number.toLowerCase());

    return new Promise((resolve) => {
      promiseTimeout = setTimeout(() => {
        const exists = existingUsers.includes(username.toLowerCase());
        resolve(exists ? `${username} is already taken.` : null);
      }, Math.random() * 500 + 100); // simulate network latency
    });
  }

  useEffect(() => {
    return () => {
      clearTimeout(promiseTimeout);
    };
  }, []);

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
        const { driver_auth_ref, start_date, end_date } = datum;
        return driver_auth_ref !== '' || [start_date, end_date].some(item => item !== null);
      })
      .map(datum => ({
        driver_auth_ref: datum.driver_auth_ref,
        driver_start_date: datum?.start_date ? dayjs(datum.start_date).format('DD/MM/YYYY') : '',
        driver_end_date: datum?.end_date ? dayjs(datum.end_date).format('DD/MM/YYYY') : ''
      }))
  }


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
          Affiliated Drivers
        </Typography>
        <DataGrid
          hideFooterPagination={true}
          rows={rows}
          columns={columns}
          editMode="cell"
          disableRowSelectionOnClick
          processRowUpdate={(a, b) => handleProcessRowUpdate(a, b)}
          slots={{
            //     toolbar: EditToolbar,
            cell: CustomCell
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}

        //    isCellEditable={(params) => params.row.id === 5}
        />
      </StyledBox>
  }
};

const CustomCell = (props) => {
  const { children, ...rest } = props;
  return (
    <GridCell {...rest}>
      {rest.cellMode === 'edit' || ((rest.value !== null && rest.value !== '') || !['start_date', 'end_date'].includes(rest.field))
        ? children
        :
        <Typography
          sx={{
            color: "#9ca3af",
            fontFamily: "Fira Sans, sans-serif",
            lineHeight: '1.5rem',

          }}
        >
          {'DD/MM/YYYY'}
        </Typography>
      }
    </GridCell>
  );
}