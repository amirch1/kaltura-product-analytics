import React from 'react';
import './Analytics.css';
import {ThemeProvider} from "@kaltura/ds-react-theme";
import { HashRouter as Router} from "react-router-dom";
import Header from "./components/header/Header";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function Analytics() {

    const onDateChange = (from: any, to: any) => {
        console.log(from, to);
    }

  return (
      <Router basename='/'>
        <ThemeProvider mode={'light'}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="app">
                  <Header onDateChange={onDateChange}></Header>
              </div>
            </LocalizationProvider>
        </ThemeProvider>
      </Router>
  );
}

export default Analytics;
