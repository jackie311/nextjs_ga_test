import { useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { severityBgColor, severityColor } from '@/services/constants';

const columns = [
  { id: 'report_id', label: 'report id' },
  { id: 'bea_number', label: 'booking entity authority number' },
  { id: 'name', label: 'authorised booking entity name' },
  {
    id: 'period_start',
    label: 'period from',
    // minWidth: 100,
  },
  {
    id: 'period_end',
    label: 'period to',
    // minWidth: 100,
  },
  {
    id: 'trading',
    label: 'trading name',
    // minWidth: 100,
  },
  {
    id: 'created_at',
    label: 'submitted at'
  },
  {
    id: 'owner',
    label: 'owner',
  },
  {
    id: 'status',
    label: 'verification status',
    align: 'center',
  },
  {
    id: 'edit',
    label: 'edit',
    // minWidth: 200,
  },
];

export default function ReportsList({ data, context }) {

  const router = useRouter();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const sortByField = (field) => (a, b) => b[field] - a[field];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: "0 2rem" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    color: "#a9a9a9",
                    fontSize: "1rem",
                    fontFamily: "Fira Sans, sans-serif",
                    fontWeight: "500",
                    lineHeight: "1.25rem",
                    fontVariant: "all-small-caps",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .sort(sortByField('key'))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.report_id}>
                    {columns.map((column) => {
                      let value = '';

                      if (column.id === 'trading') value = context.trading_name;

                      if (column.id === 'name') value = context.name;
                      if (column.id === 'bea_number') value = context.bea_number
                      if (['owner', 'report_id'].includes(column.id)) value = value = row[column.id];

                      //somehow valueFormatter does not work properly, so have to format date here
                      if (['period_start', 'period_end', 'created_at'].includes(column.id)) {
                        const date = new Date(row[column.id]);
                        value = dayjs(date).format('DD/MM/YYYY');
                      }

                      if (column.id === "status") {
                        return <TableCell key={column.id} align='right' sx={{
                          padding: "1rem 1.5rem"
                        }} >
                          <Box
                            sx={{
                              backgroundColor: row.status ? severityBgColor['complete'] : severityBgColor['action required'],
                              color: row.status ? severityColor['complete'] : severityColor['action required'],
                              textTransform: "capitalize",
                              borderRadius: "24px",
                              padding: "5px 00px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              lineHeight: "1.25rem",
                              textAlign: "center",
                              fontSize: "0.9rem",
                            }}
                          >
                            {row.status ? 'complete' : 'action required'}
                          </Box>
                        </TableCell>
                      }

                      if (column.id === 'edit') {
                        return <TableCell key={column.id}
                          sx={{ cursor: "pointer" }}
                          onClick={() => router.push({
                            pathname: `/${row.report_id}`,
                            query: { from: row['period_start'], to: row['period_end'] },
                          })} >
                          <ModeEditIcon sx={{ color: "#a9a9a9" }} />
                        </TableCell>
                      }

                      return <TableCell
                        key={column.id}
                        sx={{
                          fontFamily: "Fira Sans, sans-serif",
                          lineHeight: "1.25rem",
                          color: '#11827'
                        }}
                      >
                        {value}
                      </TableCell>
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          padding: "3rem 0 0 0 !important",
          "&>div": {
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb"
          }
        }}
      />
    </Paper>
  );
}
