import React, {useCallback, useEffect, useState} from 'react';
import './TopVideos.css';
import {Dayjs} from "dayjs";
import AreaBlocker from "../../shared/area-blocker/AreaBlocker";
import {
    KalturaEndUserReportInputFilter,
    KalturaPager, KalturaReportGraph,
    KalturaReportInterval, KalturaReportResponseOptions,
    KalturaReportType
} from "kaltura-typescript-client/api/types";
import {ReportService} from "../../services/report-service";
import {DateFilterUtils} from "../../shared/utils/date-filter-utils";
import {analyticsConfig} from "../../configuration/analytics-config";
import {ReportUtils} from "../../shared/utils/report-utils";
import ReactECharts from 'echarts-for-react';

export interface TopVideosProps {
    dateRange: [Dayjs, Dayjs];
}

function TopVideos(props: TopVideosProps) {
    const {dateRange} = props;

    const [loading, setLoading] = useState(false);
    const [graphOptions, setGraphOptions] = useState({});

    useEffect(() => {
        if (dateRange[0].valueOf() !== dateRange[1].valueOf()) {
            console.log("load report!", dateRange);
        }
    }, [dateRange]);

    const loadReport = useCallback(() => {
        setLoading(true);
        const reportType = KalturaReportType.topContentCreator;
        const pager: KalturaPager = new KalturaPager({pageSize: 25, pageIndex: 1});
        const filter: KalturaEndUserReportInputFilter = new KalturaEndUserReportInputFilter({
            searchInTags: true,
            searchInAdminTags: false,
            timeZoneOffset: DateFilterUtils.getTimeZoneOffset(),
            interval: KalturaReportInterval.days,
            fromDate: dateRange[0].toDate(),
            toDate: dateRange[1].toDate()
        });
        const responseOptions: KalturaReportResponseOptions = new KalturaReportResponseOptions({
            delimiter: analyticsConfig.valueSeparator,
            skipEmptyDates: false
        });
        const config = {reportType, pager, filter, responseOptions};
        const metrics = ["count_loads","count_plays","unique_known_users","sum_time_viewed","avg_view_drop_off","avg_completion_rate"];

        ReportService.getGraph(config).then(
            result => {
                setLoading(false);
                const graphs = ReportUtils.parseGraphs(result as KalturaReportGraph[], metrics);
                const options = {
                    xAxis: {
                        type: 'category',
                        data: graphs.map(point => point.date)
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: graphs.map(point => point.count_plays),
                            type: 'line'
                        }
                    ]
                };
                setGraphOptions(options);
            },
            error => {
                setLoading(false);
                debugger;
            }
        );

    }, [dateRange])

  return (
      <AreaBlocker loading={loading}>
          <span>Top Videos</span>
          <span onClick={loadReport} className="btn">Load report</span>
          <ReactECharts option={graphOptions} />
      </AreaBlocker>

  );
}

export default TopVideos;
