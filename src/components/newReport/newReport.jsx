import { useState } from 'react';
import axios from 'axios';
import { Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Button } from '@aws-amplify/ui-react';;
import LoadingButton from "@mui/lab/LoadingButton";

import Layout from '../layout';
import Booking from './booking';
import Drivers from './driver';
import Vehicles from './vehicles';
import Areas from './areas';
import Success from '../modal/submit';


export default function NewReport() {

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState({});
  const [loading, setLoading] = useState(false);

  const { reportId } = router.query;

  const {
    render: BookingRender,
    payload: bookingPayload
  } = Booking({ reportId });

  const {
    render: DriversRender,
    payload: driversPayload
  } = Drivers({});

  const {
    render: VehiclesRender,
    payload: vehiclesPayload
  } = Vehicles({ setEnableSubmit, enableSubmit });

  const {
    render: AreasRender,
    payload: areasPayload
  } = Areas({});

  const payload = {
    report: bookingPayload,
    driver: driversPayload,
    vehicle: vehiclesPayload,
    area: areasPayload
  }

  console.log('Create_Report_Payload', payload)
  const submit = () => {
    setLoading(true);
    setOpen(true);
    axios({
      method: 'post',
      url: `https://ac4zgv7h98.execute-api.ap-southeast-2.amazonaws.com/poc/bea/1/report/${payload.report.report_id}`,
      data: payload
    })
      .then(res => {
        setLoading(false);
        setOpen(true);
      })
      .catch(error => {
        console.error('Fail to submit', error)
        setLoading(false);
      })
  }

  return (
    <Layout>
      <Box sx={{
        display: 'flex',
        padding: "8rem 2rem 0 2rem",
        justifyContent: "space-between"
      }}>
        <Typography
          sx={{
            fontFamily: "Fira Sans, sans-serif",
            fontWeight: 500,
            lineHeight: "2.5rem",
            fontSize: "2rem"
          }}
        >
          Authorised Booking Entity Quarterly Report
        </Typography>
      </Box>

      {BookingRender}
      {DriversRender}
      {VehiclesRender}
      {AreasRender}
      <Box sx={{
        display: "flex",
        margin: "8rem 0 8rem 2rem"
      }}>
        <Button
          color="#09549f"
          backgroundColor="#f5fafe"
          fontFamily="Fira Sans, sans-serif"
          fontWeight={500}
          padding="10px 24px"
          fontSize={"1rem"}
          borderRadius={"6px"}
          style={{ borderStyle: "unset" }}
          gap="0.3rem"
          height="3rem"
          marginRight="2rem"
          onClick={() => router.push('/')}
        >
          Cancel
        </Button>
        <Button
          color="#fff"
          disabled={!(Object.values(enableSubmit).length === 0 || Object.values(enableSubmit).every(v => v === true))}
          backgroundColor={!(Object.values(enableSubmit).length === 0 || Object.values(enableSubmit).every(v => v === true)) ? "#9a9a9a" : "#003c69"}
          fontWeight={"lighter"}
          fontFamily="Fira Sans, sans-serif"
          lineHeight={"1rem"}
          padding="10px 24px"
          fontSize={"1.1rem"}
          borderRadius={"6px"}
          style={{ borderStyle: "unset" }}
          height="3rem"
          onClick={submit}
        >
          Submit
        </Button>
      </Box>
      <Success
        open={open}
        loading={loading}
        close={() => setOpen(false)}
      />
    </Layout>

  )
}