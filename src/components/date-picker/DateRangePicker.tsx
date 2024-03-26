import React, {useCallback, useState} from 'react';
import './DateRangePicker.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ChevronDown24Icon } from '@kaltura/ds-react-icons';
import { ChevronUp24Icon } from '@kaltura/ds-react-icons';
import {Button} from "@kaltura/ds-react-bits";
import { Dayjs } from "dayjs";
import 'dayjs/locale/en';

export interface DateRangeProps {
    onDateChange: (from: any, to: any) => void;
    dateRange: [Dayjs, Dayjs];
}

function DateRangePicker(props: DateRangeProps) {
    const {onDateChange, dateRange} = props;

    const [open, setOpen] = useState(false);

    const [fromValue, setFromValue] = useState<Dayjs | null>(() => {
        return dateRange[0];
    });
    const [toValue, setToValue] = useState<Dayjs | null>(() => {
        return dateRange[1];
    });

    const handleFromChange = useCallback((newDate: Dayjs | null) => {
        setFromValue(newDate);
    }, [setFromValue]);


    const handleToChange = useCallback((newDate: Dayjs | null) => {
        setToValue(newDate);
    }, [setToValue]);

    const toggleOpen = useCallback(() => {
        setOpen(!open)
    }, [setOpen, open]);

    const apply = useCallback(() => {
        onDateChange(fromValue!.set('hour', 0).set('minute', 0).set('second', 0), toValue!.set('hour', 23).set('minute', 59).set('second', 59));
        setOpen(false);
    }, [toValue, fromValue, onDateChange]);

  return (
      <div className="picker">
          <div className="range" onClick={toggleOpen}>
              <span>{fromValue!.format('DD/MM/YYYY')}</span> - <span>{toValue!.format('DD/MM/YYYY')}</span>
              {!open && <ChevronDown24Icon/>}
              {open && <ChevronUp24Icon/>}
          </div>
          {open && <div className="dates">
              <span className="label">From:</span>
              <DatePicker value={fromValue} onChange={handleFromChange}/>
              <span className="label marginTop">To:</span>
              <DatePicker value={toValue} onChange={handleToChange}/>
              <Button onClick={apply} className="btn">Apply</Button>
          </div>}
      </div>
  );
}

export default DateRangePicker;
