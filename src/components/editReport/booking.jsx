import { useState, useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import { Box } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import CommonInput from "@/common/commonInput";
import DateSelect from "@/common/dateSelect";
import { EntityContext } from '@/context/globalContext';

export default function Booking({ props }) {
  const [startDate, setStarteDate] = useState();
  const [endDate, setEndDate] = useState(props.to);
  const context = useContext(EntityContext);

  useEffect(() => {
   if (props.from) {
    setStarteDate(dayjs(new Date(props.from)));
    setEndDate(dayjs(new Date(props.to)));
   }
  }, [props.from])

  const payload = {
    entity_id: 1,
    // created_by: "barrythetaxidriver@gmail.com",
    report_id: props.reportId,
    report_start_date: dayjs(startDate).format('DD/MM/YYYY'),
    report_end_date: dayjs(endDate).format('DD/MM/YYYY')
  }

  if (!Object.keys(context).length) return {render: null}

  return {
    payload,
    render:
      <>
        <Box paddingLeft="2rem">
          <CommonInput
            title="Authorised Booking Entity Name"
            disabled={true}
            defaultValue={context.name}
            iconPosition="end"
            Icon={LockOutlinedIcon}
          />
          <CommonInput
            title="Trading Name"
            disabled={true}
            defaultValue={context.trading_name}
            iconPosition="end"
            Icon={LockOutlinedIcon}
          />
          <CommonInput
            title="Booking Entity Authority Number"
            disabled={true}
            defaultValue={context.bea_number}
            iconPosition="end"
            Icon={LockOutlinedIcon}
          />
          <DateSelect
            title='Quarterly Period From'
            value={startDate}
            setValue={setStarteDate}
            requiredField={true}
          />
          <DateSelect
            title='Quarterly Period To'
            value={endDate}
            setValue={setEndDate}
            requiredField={true}
          />
        </Box>
      </>
  }
}