
import { useState, useCallback, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridCell, GridCellModes } from '@mui/x-data-grid';
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { serviceAreas } from "@/services/constants";


const StyledBox = styled(Box)(({ theme }) => ({
  height: 430,
  width: '45rem',
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

export default function Areas({ props }) {
  const preProcessEditCellProps = async (params) => {
    const errorMessage = await validateName(params?.props?.value?.toString());
    return { ...params.props, error: errorMessage };
  };

  const region = useRef(null)
  const [cellModesModel, setCellModesModel] = useState({})
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (props?.length) {
      const data = initialData(props);
      setRows(data);
    }
  }, [props]);

  const initialData = (data) => {
    return data.reduce((array, row, i) => {
      array.push({
        ...row,
        id: i + 1,
      });
      return array
    }, []);
  }


  const remove = (id) => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { region: "", area: "", id }
      }
      return row;
    });
    setRows(newRows)
  }

  const columns = [
    {
      field: 'region',
      headerName: 'REGION',
      width: 240,
      editable: true,
      type: 'singleSelect',
      valueOptions: Object.keys(serviceAreas),
    },
    {
      field: 'area',
      headerName: 'TAXI SERVICE AREA',
      width: 240,
      editable: true,
      type: 'singleSelect',
      valueOptions: ({ row }) => {
        return row.region ? serviceAreas[row.region] : null
      }
    },

    {
      field: 'action',
      headerName: 'ACTIONS',
      width: 100,
      editable: true,
      preProcessEditCellProps,

      type: 'actions',
      getActions: (props) => {
        return [props?.row?.region, props?.row?.area].every(str => str === '') ?
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

  const handleCellClick = useCallback((params) => {
    if (params.isEditable) {
      setCellModesModel(prevModel => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View }
                }),
                {}
              )
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit }
          }
        }
      })
    }
  }, [])
  const handleCellModesModelChange = useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);

  const generatePayload = (rows) => rows.map(row => ({
   // journey_region: row.region,
    journey_area: row.area
  }))

  return {
    payload: generatePayload(rows),
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
          Service Areas
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="cell"
          cellModesModel={cellModesModel}
          disableRowSelectionOnClick
          onCellClick={handleCellClick}
          onCellModesModelChange={handleCellModesModelChange}
          processRowUpdate={(a, b) => handleProcessRowUpdate(a, b)}
          isCellEditable={(params) => params.field !== 'action' || params.field === 'action' && params.cellMode === 'edit'}
          onRowEditStart={(params) => {
            region.current = params.row.region;
          }}
          experimentalFeatures={{ newEditingApi: true }}
          slots={{
            //     toolbar: EditToolbar,
            cell: CustomCell
          }}
        />
      </StyledBox>
  }
};

const CustomCell = (props) => {
  const { children, ...rest } = props;
  const showIcon = rest.cellMode === 'edit' || ((rest.value !== null && rest.value !== '') || !['region', 'area'].includes(rest.field))
  return (
    <>
      {showIcon ?
        (<GridCell {...rest}>
          {children}
        </GridCell>
        ) :
        (<GridCell {...rest} className={"MuiDataGrid-cell--textRight"}>
          <KeyboardArrowDownIcon sx={{ color: "#9a9a9a" }} />
        </GridCell>
        )
      }</>
  );
}
