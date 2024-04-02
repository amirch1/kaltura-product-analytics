import React, {useCallback, useState} from 'react';
import './DateRangePicker.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {ChevronDown24Icon} from '@kaltura/ds-react-icons';
import { ChevronUp24Icon } from '@kaltura/ds-react-icons';
import { ReactComponent as ArrowRight} from '../../assets/ArrowRight.svg'
import { Dayjs } from "dayjs";
import 'dayjs/locale/en';

export interface DateRangeProps {
    onDateChange: (from: any, to: any) => void;
    dateRange: [Dayjs, Dayjs];
}

function DateRangePicker(props: DateRangeProps) {
    const {onDateChange, dateRange} = props;

    const [open, setOpen] = useState(true);

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

    const apply = useCallback(() => {
        onDateChange(fromValue!.set('hour', 0).set('minute', 0).set('second', 0), toValue!.set('hour', 23).set('minute', 59).set('second', 59));
        setOpen(false);
    }, [toValue, fromValue, onDateChange]);

  return (
      <div className={open ? 'datesContainer open' : 'datesContainer'}>
          <div className="picker">
              <div className="range" onClick={() => setOpen(!open)}>
                  {open && <span>Select period</span>}
                  {!open && <span>{dateRange[0].format('YYYY/MM/DD') + ' - ' + dateRange[1].format('YYYY/MM/DD')}</span>}
                  {open && <ChevronDown24Icon className="arrow"/>}
                  {!open && <ChevronUp24Icon className="arrow"/>}
              </div>
              <div className="labels">
                  <span>From</span>
                  <span style={{marginLeft: '173px'}}>To</span>
              </div>
              <div className="dates">
                  <DatePicker value={fromValue} onChange={handleFromChange}/>
                  <ArrowRight className="arroRight"/>
                  <DatePicker value={toValue} onChange={handleToChange}/>
              </div>
              <div onClick={apply} className="btn"><span>Apply</span></div>
          </div>
      </div>

  );
}

export default DateRangePicker;
