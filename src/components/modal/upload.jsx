import { useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import axios from 'axios';
import Modal from "@mui/material/Modal";
import Image from 'next/image'
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import { Button, Flex } from '@aws-amplify/ui-react';;
import { Paper } from "@mui/material";
import { CircularProgress } from "@mui/material"
import { FileUploader } from "react-drag-drop-files";

import Loader from "@/common/loader";

export default function UploadModal({
  open,
  close,
  reportKey,
  setReports,
  setId
}) {
  const fileTypes = ["CSV"];
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false)

  const handleChange = (file) => {
    setLoading(true);

    const currentTimestamp = dayjs().valueOf();
    const filename = `inbound/1-${currentTimestamp}.csv`

    axios({
      method: 'get',
      url: `https://ac4zgv7h98.execute-api.ap-southeast-2.amazonaws.com/poc/bea/1/upload?filename=${filename}`,
    })
      .then((res) => {
        axios({
          method: 'put',
          url: res.data.url,
          data: file,
        })
          .then(res => {
            setLoading(false);
            setSuccess(true);
          })
      })
      .catch(error => console.error('Failed to upload', error))

  };

  const closeModal = () => {
    setLoading(true);
    axios({
      method: 'get',
      url: "https://ac4zgv7h98.execute-api.ap-southeast-2.amazonaws.com/poc/bea/1/report"
    })
      .then(res => {
        setReports(res?.data?.reports);
        setId((res?.data?.reports || []).length + 1);
        setSuccess(false);
        setTimeout(() => {
          setLoading(false);
          close();
        }, 1500)
      })
  }


  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="upload modal"
      aria-describedby="upload csv"
      disableEscapeKeyDown={true}
    >
      <Box sx={{
        top: "50%",
        left: "50%",
        width: "60rem",
        minHeight: "90%",
        height: "40rem",
        maxHeight: '80%',
        padding: '4rem 5rem',
        minHeight: '25rem',
        position: "absolute",
        backgroundColor: "#fff",
        borderRadius: "8px",
        transform: "translate(-50%, -50%)",
        boxShadow: "0px 4px 6px -1px rgba(16, 24, 40, 0.1)",
        display: 'flex', flexDirection: 'column',
      }}>


        {!isSuccess && <Typography sx={{

          fontFamily: "Fira Sans",
          fontWeight: 500,
          fontSize: "2rem",
          lineHeight: "2.5rem",
          letterSpacing: "0.64px",
          marginBottom: "2rem"
        }}>
          Upload CSV file
        </Typography>}



        {!isSuccess && <FileUploader handleChange={handleChange} name="file" types={fileTypes} hoverTitle=" ">
          <Paper sx={{
            borderRadius: "6px",
            border: "0.8px dashed #003c69",
            height: "25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}>

            {loading &&
              <Box>
                <CircularProgress sx={{ color: "#003c69" }} />
              </Box>}

            {!loading && <> <Image
              src="/arrow_up.png"
              width={38}
              height={51}
              alt="submitted successfully"
            />

              <Typography sx={{
                marginTop: "1rem",
                color: "#a9a9a9",
                fontFamily: "Fira Sans",
                fontWeight: 400,
                fontSize: "1.5rem",
                lineHeight: "2.5rem",
                letterSpacing: "-0.48px"
              }}>
                Drop file here or
              </Typography>

              <Button
                color="#fff"
                backgroundColor="#003c69"
                fontWeight={"lighter"}
                fontFamily="Fira Sans"
                lineHeight={"1rem"}
                padding="10px 24px"
                fontSize={"1.1rem"}
                borderRadius={"6px"}
                style={{ borderStyle: "unset" }}
                height="3rem"
                marginTop={"1rem"}
              >
                {/* <input
                  hidden
                  accept=".csv"
                  type="file"
                  // onChange={uploadDoc}
                /> */}
                Browse file
              </Button> </>}
          </Paper>
        </FileUploader>}
        {isSuccess &&
          <Box sx={{
            top: "50%",
            left: "50%",
            width: "60rem",
            minHeight: "90%",
            height: "40rem",
            maxHeight: '80%',
            padding: '2rem',
            minHeight: '25rem',
            position: "absolute",
            backgroundColor: "#fff",
            borderRadius: "8px",
            transform: "translate(-50%, -50%)",
            display: 'flex', justifyContent: 'center', flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Image
                src="/success.png"
                width={160}
                height={160}
                alt="submitted successfully"
              />
              <Typography sx={{
                textAlign: "center",
                fontFamily: "Fira Sans",
                fontWeight: 500,
                fontSize: "2rem",
                lineHeight: "2.5rem",
                letterSpacing: "0.64px"
              }}>
                File Upload Successful.
              </Typography>
              <Typography sx={{
                textAlign: "center",
                fontFamily: "Fira Sans",
                fontWeight: 400,
                fontSize: "1rem",
                lineHeight: "2.5rem",
              }}>
                Please check the dashboard and your email whether the data could be ingested successfully.
              </Typography>
            </Box>

            <Button
              color="#fff"
              backgroundColor="#003c69"
              fontWeight={"lighter"}
              fontFamily="Fira Sans"
              lineHeight={"1rem"}
              padding="10px 24px"
              fontSize={"1.1rem"}
              borderRadius={"6px"}
              style={{ borderStyle: "unset" }}
              height="3rem"
              marginTop={"1rem"}
              onClick={closeModal}
            >
              Back to Dashboard
            </Button>
          </Box>
        }
      </Box>
    </Modal>
  )
}

