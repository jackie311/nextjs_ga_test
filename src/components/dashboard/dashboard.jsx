import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";
import { View, Text, Button, Icon } from '@aws-amplify/ui-react';

import Layout from '../layout';
import ReportsList from "./reportList";
import UploadModal from "../modal/upload";
import { EntityContext } from '@/context/globalContext';
import Loader from '@/common/loader';


export default function Dashboard() {

  const router = useRouter();
  const context = useContext(EntityContext);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [nextId, setId] = useState();


  useEffect(() => {
    setLoading(true);
    axios({
      method: 'get',
      url: "https://ac4zgv7h98.execute-api.ap-southeast-2.amazonaws.com/poc/bea/1/report"
    })
      .then(res => {
        setLoading(false);
        setReports(res?.data?.reports);
        setId((res?.data?.reports || []).length + 1)
      })
      .catch(() => {
        setLoading(false);
        console.error('Fail to fetch report list')
      });

  }, []);

  const download = () => {
    axios({
      method: 'get',
      url: 'https://ac4zgv7h98.execute-api.ap-southeast-2.amazonaws.com/poc/bea/1/audit'
    })
      .then(res => {
        console.log('res',res)
        window.open(res.data.url)
      })
      .catch(() => console.error('Fail to download audit log'));
  }

  if (loading) return <Loader />

  return (
    <Layout>
      <View
        display="flex"
        margin="8rem 2rem 2.5rem 2rem"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          variation="primary"
          lineHeight="2.5em"
          fontWeight={500}
          fontSize="2em"
          fontStyle="normal"
          fontFamily="Fira Sans, sans-serif"
        >
          Manage Reports
        </Text>
        <View display="flex">
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
            onClick={download}
          >
            <Icon ariaLabel='Download Audit Log' >
              <path d="M1.875 14.0625L1.875 15.0781C1.875 16.7609 3.23913 18.125 4.92188 18.125L15.0781 18.125C16.7609 18.125 18.125 16.7609 18.125 15.0781L18.125 14.0625M14.0625 10L10 14.0625M10 14.0625L5.9375 10M10 14.0625L10 1.875" stroke="#09549F" strokeWidth="2.0025" strokeLinecap="round" strokeLinejoin="round" />
            </Icon>
            Download Audit Log
          </Button>
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
            onClick={() => setOpen(true)}
          >
            <Icon ariaLabel='Download Audit Log' >
              <path d="M3.33325 13.3334L3.33325 14.1667C3.33325 15.5475 4.45254 16.6667 5.83325 16.6667L14.1666 16.6667C15.5473 16.6667 16.6666 15.5475 16.6666 14.1667L16.6666 13.3334M13.3333 6.66675L9.99992 3.33342M9.99992 3.33342L6.66658 6.66675M9.99992 3.33342L9.99992 13.3334" stroke="#09549F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Icon>
            Upload CSV File
          </Button>
          <Button
            color="#fff"
            backgroundColor="#003c69"
            fontWeight={"lighter"}
            fontFamily="Fira Sans, sans-serif"
            lineHeight={"1.5rem"}
            padding="10px 24px"
            fontSize={"1.1rem"}
            borderRadius={"6px"}
            style={{ borderStyle: "unset" }}
            height="3rem"
            onClick={() => router.push({
              pathname: `new_report`,
              query: { reportId: nextId },
            })}
          >
            <Icon ariaLabel='Create New Report' marginRight="7px" size="small" >
              <path d="M10 5V15M15 10L5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Icon>
            Create New Report
          </Button>
        </View>
      </View>
      <ReportsList data={reports} context={context} />
      <UploadModal
        open={open}
        reportKey={reports.length + 1}
        close={() => setOpen(false)}
        setId={setId}
        setReports={setReports}
      />
    </Layout >
  )
}