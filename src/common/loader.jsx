
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material"

export default function Loader() {

  return (
    <Box position={"absolute"} top={"50%"} left={"55%"} magin={"auto"}>
      <CircularProgress sx={{color: "#003c69"}} />
    </Box>
  );
}