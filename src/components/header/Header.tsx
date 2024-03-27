import React from 'react';
import './Header.css';
import DateRangePicker from "../date-picker/DateRangePicker";
import {Dayjs} from "dayjs";
import {ChevronDown24Icon, ChevronUp24Icon} from "@kaltura/ds-react-icons";

export interface HeaderProps {
    onDateChange: (from: any, to: any) => void;
    onToggleFilter: () => void;
    dateRange: [Dayjs, Dayjs];
    filterOpen: boolean;
}

function Header(props: HeaderProps) {
    const {onDateChange, dateRange, filterOpen, onToggleFilter} = props;

  return (
      <div className="header">
            <span className="title">Product Analytics</span>
          <div className="filterBtn" onClick={onToggleFilter}>
              <span className="marginRight">Filter</span>
              {!filterOpen && <ChevronDown24Icon className="arrow"/>}
              {filterOpen && <ChevronUp24Icon className="arrow"/>}
          </div>
            <div className="pushLeft">
                <DateRangePicker onDateChange={onDateChange} dateRange={dateRange}/>
            </div>
      </div>
  );
}

export default Header;
