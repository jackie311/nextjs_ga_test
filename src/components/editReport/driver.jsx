
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
    position: "relative",
    top: "-16px"
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

export default function Drivers({ props, openTooltip }) {

  const preProcessEditCellProps = async (params) => {
    const errorMessage = await validateName(params?.props?.value?.toString());
    return { ...params.props, error: errorMessage };
  };

  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (props?.length) {
      const data = initialData(props);

      setRows(data);
    }
  }, [props])

  const initialData = (data) => {
    return data.reduce((array, row, i) => {
      array.push({
        ...row,
        driver_start_date: row.driver_start_date ? new Date(row.driver_start_date) : null,
        driver_end_date: row.driver_end_date ? new Date(row.driver_end_date) : null,
        id: i + 1,
      });

      return array
    }, []);
  }

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
      valueFormatter: ({ value }) => value,
      renderCell: (params) => {

        if (params.row.verification_status === false)

          return <StyledTooltip open={openTooltip} title={params.row.verification_issue_message}>
            <Typography>{params.row.driver_auth_ref}</Typography>
          </StyledTooltip>
      }
    },
    {
      field: 'driver_start_date',
      type: "date",
      headerName: 'START DATE OF AFFILIATION',
      width: 180,
      editable: true,
      valueGetter: ({ value }) => {
        if (value?.toString() === 'Invalid Date') return null;
        return value
      }
    },
    {
      field: 'driver_end_date',
      type: "date",
      headerName: 'END DATE OF AFFILIATION',
      width: 180,
      editable: true,
      valueGetter: ({ value }) => {

        if (value?.toString() === 'Invalid Date') {
          return null
        }
        return value
      }
    },
    {
      field: 'action',
      headerName: 'ACTIONS',
      width: 100,
      editable: true,
      type: 'actions',
      getActions: (props) => {

        return [props?.row?.driver_auth_ref, props?.row?.driver_end_date, props?.row?.driver_start_date].every(str => !str) ?
          [] : [<GridActionsCellItem
          key={props?.row?.driver_auth_ref}
            icon={<DeleteIcon sx={{ color: "#a9a9a9" }} />}
            label="Delete"
            color="inherit"
            onClick={() => remove(props.row.id)}
          />]
      }
    },
  ];

  const remove = (id) => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { driver_auth_ref: "", driver_start_date: null, id, driver_end_date: null }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return data.map(datum => ({
      driver_auth_ref: datum.driver_auth_ref,
      driver_start_date: datum?.driver_start_date !== null ? dayjs(datum.driver_start_date).format('DD/MM/YYYY') : null,
      driver_end_date: datum?.driver_end_date !== null ? dayjs(datum.driver_end_date).format('DD/MM/YYYY') : null
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
      {rest.cellMode === 'edit' || ((rest.value !== null && rest.value !== '') || !['driver_start_date', 'driver_end_date'].includes(rest.field))
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