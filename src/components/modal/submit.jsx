import Box from "@mui/material/Box";
import Container from "@mui/material";
import Modal from "@mui/material/Modal";
import Image from 'next/image'
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import { Button } from '@aws-amplify/ui-react';;
import { CircularProgress } from "@mui/material"

export default function SuccessModal({
  open,
  close,
  loading = false
}) {

  const router = useRouter();

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown={true}
      BackdropProps={{
        onClick: (event) => {
          event.stopPropagation();
        },
      }}
    >
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
        boxShadow: "0px 4px 6px -1px rgba(16, 24, 40, 0.1)",
        display: 'flex', justifyContent: 'center', flexDirection: 'column',
        alignItems: 'center'
      }}>
        {!loading && <Box sx={{
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
            fontFamily: "Fira Sans, sans-serif",
            fontWeight: 500,
            fontSize: "2rem",
            lineHeight: "2.5rem",
            letterSpacing: "0.64px"
          }}>
            Report submitted successfully.
          </Typography>
          <Typography sx={{
            textAlign: "center",
            fontFamily: "Fira Sans, sans-serif",
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: "2.5rem",
          }}>
            Please check Dashboard for status
          </Typography>
        </Box>}

      {!loading &&  <Button
          color="#fff"
          backgroundColor="#003c69"
          fontWeight={"lighter"}
          fontFamily="Fira Sans, sans-serif"
          lineHeight={"1rem"}
          padding="10px 24px"
          fontSize={"1.1rem"}
          borderRadius={"6px"}
          style={{ borderStyle: "unset" }}
          height="3rem"
          marginTop={"1rem"}
          onClick={() => {
            close;
            router.push('/')
          }}
        >
          Back to Dashboard
        </Button>}
        {loading &&
          <Box>
            <CircularProgress sx={{ color: "#003c69" }} />
          </Box>
        }
      </Box>
    </Modal>
  )
}