import React, {useState} from 'react';
import './Analytics.css';
import {ThemeProvider} from "@kaltura/ds-react-theme";
import { HashRouter as Router} from "react-router-dom";
import Header from "./components/header/Header";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, {Dayjs} from "dayjs";
import TopVideos from "./views/top-videos/TopVideos";

function Analytics() {

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
        return [dayjs().set('hour', 0).set('minute', 0).set('second', 0), dayjs().set('hour', 23).set('minute', 59).set('second', 59)];
    });

    const onDateChange = (from: any, to: any) => {
        setDateRange([from, to]);
    }

  return (
      <Router basename='/'>
        <ThemeProvider mode={'light'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="app">
                  <Header onDateChange={onDateChange} dateRange={dateRange}></Header>
                  <TopVideos dateRange={dateRange}></TopVideos>
              </div>
            </LocalizationProvider>
        </ThemeProvider>
      </Router>
  );
}

export default Analytics;
