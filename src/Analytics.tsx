import React, {useState} from 'react';
import './Analytics.css';
import {ThemeProvider} from "@kaltura/ds-react-theme";
import { HashRouter as Router} from "react-router-dom";
import Header from "./components/header/Header";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, {Dayjs} from "dayjs";
import TopVideos from "./views/top-videos/TopVideos";
import Filter from "./shared/filter/Filter";
import Geo from "./views/geo/Geo";

function Analytics() {

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
        return [dayjs().set('hour', 0).set('minute', 0).set('second', 0), dayjs().set('hour', 23).set('minute', 59).set('second', 59)];
    });
    const onDateChange = (from: any, to: any) => {
        setDateRange([from, to]);
    }

    const [filterOpen, setFilterOpen] = useState(false);
    const onToggleFilter = () => {
        setFilterOpen(!filterOpen);
    }

  return (
      <Router basename='/'>
        <ThemeProvider mode={'light'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="app">
                  <Header onDateChange={onDateChange} dateRange={dateRange} filterOpen={filterOpen} onToggleFilter={onToggleFilter}></Header>
                  <Filter open={filterOpen}></Filter>
                  <TopVideos dateRange={dateRange}></TopVideos>
                  <Geo dateRange={dateRange}></Geo>
              </div>
            </LocalizationProvider>
        </ThemeProvider>
      </Router>
  );
}

export default Analytics;
