import React from 'react';
import './Header.css';
import DateRangePicker from "../date-picker/DateRangePicker";
import {Dayjs} from "dayjs";

export interface HeaderProps {
    onDateChange: (from: any, to: any) => void;
    dateRange: [Dayjs, Dayjs];
}

function Header(props: HeaderProps) {
    const {onDateChange, dateRange} = props;

  return (
      <div className="header">
            <span className="title">Product Analytics</span>
            <div className="pushLeft">
                <DateRangePicker onDateChange={onDateChange} dateRange={dateRange}/>
            </div>
      </div>
  );
}

export default Header;
