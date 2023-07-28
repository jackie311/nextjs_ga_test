import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const Title = styled(Typography)(() => ({
  fontWeight: '500',
  fontSize: '2rem',
  lineHeight: '3.5rem',
  letterSpacing: '-0.02rem'
}));

export const SubTitle = styled(Typography)(() => ({
  fontWeight: '500',
  fontSize: '1.5rem',
  lineHeight: '2rem',
  letterSpacing: '-0.02rem',
  marginTop: '1.5rem'
}))

export const FieldTitle = styled('span')(() => ({
  display: 'block',
  fontSize: "0.9rem",
  lineHeight: "1.25rem",
  fontWeight: 600,
  marginBottom: "5px",
  color: "#111827",
  maxWidth: '25rem'
}));


export const Mandatory = styled('p')(() => ({
  display: 'inline',
  color: '#EF4444'
}))