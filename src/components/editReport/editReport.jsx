import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Button } from '@aws-amplify/ui-react';;

import Layout from '../layout';
import Booking from './booking';
import Drivers from './driver';
import Vehicles from './vehicles';
import Areas from './areas';
import Success from '../modal/submit';
import Loader from '@/common/loader';



export default function EditReport() {

  const router = useRouter();

  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [openTooltip, setTooltip] = useState(true);
  const [loading, setLoading] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState({});

  const { id, from, to } = router.query;

  useEffect(() => {
    if (id) {
      setLoading(true);

      axios({
        method: 'get',
        url: `https://ac4zgv7h98.execute-api.ap-southeast-2.amazonaws.com/poc/bea/1/report/${id}`,
      })
        .then(res => {
          setLoading(false);
          setData(res?.data?.body?.report);
        })
        .catch(() => {
          setLoading(false);
        })
    }
  }, [id]);


  const {
    render: BookingRender,
    payload: bookingPayload
  } = Booking({
    props:
    {
      entity_id: id,
      versionId: data?.version_id,
      reportId: data?.report_id,
      from,
      to
    }
  });

  const {
    render: DriversRender,
    payload: driversPayload
  } = Drivers({ props: data?.driver, openTooltip });

  const {
    render: VehiclesRender,
    payload: vehiclesPayload
  } = Vehicles({ props: data?.vehicle, openTooltip, setTooltip, setEnableSubmit, enableSubmit });

  const {
    render: AreasRender,
    payload: areasPayload
  } = Areas({ props: data?.journey });

  const payload = {
    report: bookingPayload,
    driver: driversPayload,
    vehicle: vehiclesPayload,
    area: areasPayload
  }

  console.log('Edit_Report_Payload', payload)
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

  if (loading || !id) return <Loader />

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
          onClick={() => {
            setTooltip(false);
            submit();
          }}
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