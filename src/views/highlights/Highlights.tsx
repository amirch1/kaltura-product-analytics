import React, {useCallback, useEffect, useState} from 'react';
import './Highlights.css';
import {Dayjs} from "dayjs";
import AreaBlocker from "../../shared/area-blocker/AreaBlocker";
import {KalturaReportInterval, KalturaReportResponseOptions, KalturaReportTotal, KalturaReportType
} from "kaltura-typescript-client/api/types";
import {ReportService} from "../../services/report-service";
import {DateFilterUtils} from "../../shared/utils/date-filter-utils";
import {analyticsConfig} from "../../configuration/analytics-config";
import {ReportUtils} from "../../shared/utils/report-utils";
import { ReactComponent as ButtonClick} from '../../assets/ButtonClicks.svg';
import { ReactComponent as PageLoads} from '../../assets/PageLoads.svg';
import {Button, TaskModal} from "@kaltura/ds-react-bits";
import {Box} from "@mui/material";
import {KalturaReportInputFilter} from "kaltura-typescript-client/api/types/KalturaReportInputFilter";

export interface HighlightsProps {
    dateRange: [Dayjs, Dayjs];
    apps: string;
    vertical: string;
    feature: string;
}

function Highlights(props: HighlightsProps) {
    const {dateRange, apps, vertical, feature} = props;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [buttonClicks, setButtonClick] = useState(0);
    const [pageLoads, setPageLoads] = useState(0);

    const loadReport = useCallback(() => {
        setLoading(true);
        const reportType = KalturaReportType.applicationEventsHighlights;
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
        const config = {reportType, filter, responseOptions, objectIds};

        ReportService.getTotal(config).then(
            result => {
                setLoading(false);
                const totals: any = ReportUtils.parseTotals(result as KalturaReportTotal);
                setButtonClick(totals.count_button_clicked);
                setPageLoads(totals.count_page_load);
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
        <div className={apps.length > 0 ? "highlights open" : "highlights"}>
            <AreaBlocker loading={loading}>
                <div className="container">
                    <span className="title">Highlights</span>
                    <div className="row">
                        <ButtonClick/>
                        <span className="value">{ReportUtils.numberWithCommas(buttonClicks)}</span>
                        <span className="label">Button clicks</span>
                    </div>
                    <div className="row">
                        <PageLoads/>
                        <span className="value">{ReportUtils.numberWithCommas(pageLoads)}</span>
                        <span className="label">Page loads</span>
                    </div>
                </div>
                {error && <TaskModal title="Error" actions={<>
                    <Button onClick={() => setError('')}>OK</Button>
                </>}>
                    <Box>{error}</Box>
                </TaskModal>}
            </AreaBlocker>
        </div>


    );
}

export default Highlights;
