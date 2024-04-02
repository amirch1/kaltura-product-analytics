import React, {useCallback, useEffect, useState} from 'react';
import './TopEvents.css';
import {Dayjs} from "dayjs";
import AreaBlocker from "../../shared/area-blocker/AreaBlocker";
import {
    KalturaPager, KalturaReportGraph,
    KalturaReportInterval, KalturaReportResponseOptions, KalturaReportType
} from "kaltura-typescript-client/api/types";
import {ReportService} from "../../services/report-service";
import {DateFilterUtils} from "../../shared/utils/date-filter-utils";
import {analyticsConfig} from "../../configuration/analytics-config";
import {ReportUtils} from "../../shared/utils/report-utils";
import ReactECharts from 'echarts-for-react';
import {Button, TaskModal} from "@kaltura/ds-react-bits";
import {Box} from "@mui/material";
import {KalturaReportInputFilter} from "kaltura-typescript-client/api/types/KalturaReportInputFilter";

export interface TopEventsProps {
    dateRange: [Dayjs, Dayjs];
    apps: string;
    vertical: string;
    feature: string;
}

function TopEvents(props: TopEventsProps) {
    const {dateRange, apps, vertical, feature} = props;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [graphOptions, setGraphOptions] = useState({});

    const loadReport = useCallback(() => {
        setLoading(true);
        const reportType = KalturaReportType.applicationEventsHighlights;
        const pager: KalturaPager = new KalturaPager({pageSize: 500, pageIndex: 0});
        const filter: KalturaReportInputFilter = new KalturaReportInputFilter({
            searchInTags: true,
            searchInAdminTags: false,
            timeZoneOffset: DateFilterUtils.getTimeZoneOffset(),
            interval: KalturaReportInterval.days,
            fromDate: dateRange[0].toDate(),
            toDate: dateRange[1].toDate(),
            kalturaAppIn: apps
        });
        if (vertical.length) {
            filter.partnerVerticalIn = vertical;
        }
        if (feature.length) {
            filter.buttonNameIn = feature;
            filter.pageNameIn = feature;
        }

        const responseOptions: KalturaReportResponseOptions = new KalturaReportResponseOptions({
            delimiter: analyticsConfig.valueSeparator,
            skipEmptyDates: false
        });
        const objectIds = ''; // value separator delimited string of partners
        const config = {reportType, pager, filter, responseOptions, objectIds};
        const metrics = ["date","count_button_clicked","count_page_load"];

        ReportService.getGraph(config).then(
            result => {
                setLoading(false);
                const graphs = ReportUtils.parseGraphs(result as KalturaReportGraph[], metrics);
                const options =  {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['Page Loads', 'Button Clicks'],
                        textStyle: {
                            color: '#ffffff'
                        }
                    },
                    grid: {
                        left: '0%',
                        right: '0%',
                        bottom: '0%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            textStyle: {
                                color: '#ffffff'
                            }
                        },
                        data: graphs.map(point => point.date)
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                color: '#ffffff'
                            }
                        }
                    },
                    series: [
                        {
                            name: 'Button Clicks',
                            color: '#FFD357',
                            data: graphs.map(point => point.count_button_clicked),
                            type: 'line'
                        },
                        {
                            name: 'Page Loads',
                            color: '#FF9DFF',
                            data: graphs.map(point => point.count_page_load),
                            type: 'line'
                        }
                    ]
                };
                setGraphOptions(options);
            },
            error => {
                setLoading(false);
                setError(error?.message || 'An error occurred');
            }
        );

    }, [dateRange, apps, vertical, feature])

    useEffect(() => {
        if (apps.length) {
            loadReport();
        }
    }, [dateRange, apps, vertical, feature, loadReport]);


    return (
        <div className={apps.length > 0 ? "topEvents open" : "topEvents"}>
            <AreaBlocker loading={loading}>
                <div className="header">
                    <span className="title">Events over time</span>
                </div>

                {apps.length > 0 && <ReactECharts option={graphOptions}/>}
                {error && <TaskModal title="Error" actions={<>
                    <Button onClick={() => setError('')}>OK</Button>
                </>}>
                    <Box>{error}</Box>
                </TaskModal>}
            </AreaBlocker>
        </div>
    );
}

export default TopEvents;
