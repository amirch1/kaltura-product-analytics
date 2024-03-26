import React, {useCallback, useState} from 'react';
import './Header.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/en';

export interface HeaderProps {
    onDateChange: (from: any, to: any) => void;
}

function Header(props: HeaderProps) {
    const {onDateChange} = props;

    const [fromValue, setFromValue] = useState<Dayjs | null>(() => {
        return dayjs();
    });
    const [toValue, setToValue] = useState<Dayjs | null>(() => {
        return dayjs();
    });

    const handleFromChange = useCallback((newDate: Dayjs | null) => {
        setFromValue(newDate);
        onDateChange(newDate, toValue);
    }, [setFromValue, toValue, onDateChange]);


    const handleToChange = useCallback((newDate: Dayjs | null) => {
        setToValue(newDate);
        onDateChange(fromValue, newDate);
    }, [setToValue, fromValue, onDateChange]);

  return (
      <div className="header">
            <span className="title">Product Analytics</span>
            <span className="label pushLeft">From:</span>
            <DatePicker value={fromValue} onChange={handleFromChange}/>
            <span className="label">To:</span>
            <DatePicker value={toValue} onChange={handleToChange}/>

      </div>
  );
}

export default Header;
