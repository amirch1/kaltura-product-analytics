import React, {useState} from 'react';
import {ThemeProvider} from "@kaltura/ds-react-theme";
import {HashRouter as Router} from "react-router-dom";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, {Dayjs} from "dayjs";
import TopEvents from "./views/top-events/TopEvents";
import Filter from "./shared/filter/Filter";
import Geo from "./views/geo/Geo";
import { ReactComponent as Logo} from './assets/logo.svg';
import { ReactComponent as Help} from './assets/Help.svg';
import { ReactComponent as Settings} from './assets/Settings.svg';
import { ReactComponent as User} from './assets/User.svg';
import { ReactComponent as ChevronDown16} from './assets/ChevronDown16.svg';
import './Analytics.css';
import DateRangePicker from "./components/date-picker/DateRangePicker";
import Highlights from "./views/highlights/Highlights";
import Features from "./views/features/Features";

function Analytics() {

    // disable the app if no KS is passed in the URL params
    const ks = new URLSearchParams(window.location.search).get('ks') || '';

    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
        return [dayjs().set('hour', 0).set('minute', 0).set('second', 0), dayjs().set('hour', 23).set('minute', 59).set('second', 59)];
    });
    const onDateChange = (from: any, to: any) => {
        setDateRange([from, to]);
    }

    const [apps, setApps] = useState('');
    const [verticals, setVerticals] = useState('');
    const [feature, setFeature] = useState('');

    const onFilterChange = (event: {apps: string, verticals: string, feature: string}) => {
        setApps(event.apps);
        setVerticals(event.verticals);
        setFeature(event.feature);
    }

    return (
        <Router basename='/'>
            <ThemeProvider mode={'light'}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {ks.length > 0 && <div className="app">
                        <div className="header">
                            <Logo/>
                            <span className="buzzboard">Buzzboard</span>
                            <div className="headerRight">
                                <Settings/>
                                <Help/>
                                <User/>
                                <span className="userName">Amir</span>
                            </div>
                            <ChevronDown16/>
                        </div>
                        <div className="filters">
                            <Filter onFilterChange={onFilterChange}></Filter>
                            <DateRangePicker onDateChange={onDateChange} dateRange={dateRange}/>
                        </div>
                        <div className="miniViews">
                            <Highlights dateRange={dateRange} apps={apps} vertical={verticals} feature={feature}></Highlights>
                            <Features dateRange={dateRange} apps={apps} vertical={verticals} feature={feature}></Features>
                        </div>
                        <div className="miniViews">
                            <TopEvents dateRange={dateRange} apps={apps} vertical={verticals} feature={feature}></TopEvents>
                        </div>
                        <div className="miniViews" style={{paddingBottom: '24px'}}>
                            <Geo dateRange={dateRange} apps={apps} vertical={verticals} feature={feature}></Geo>
                        </div>
                    </div>}
                    {ks.length === 0 && <div className="nothing">Nothing to see here...</div>}
                </LocalizationProvider>
            </ThemeProvider>
        </Router>
    );
}

export default Analytics;
