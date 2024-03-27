import React, {useCallback, useEffect, useState} from 'react';
import './Geo.css';
import {Dayjs} from "dayjs";
import AreaBlocker from "../../shared/area-blocker/AreaBlocker";
import {
    KalturaEndUserReportInputFilter,
    KalturaPager,
    KalturaReportInterval, KalturaReportResponseOptions, KalturaReportTable,
    KalturaReportType
} from "kaltura-typescript-client/api/types";
import {ReportService} from "../../services/report-service";
import {DateFilterUtils} from "../../shared/utils/date-filter-utils";
import {analyticsConfig} from "../../configuration/analytics-config";
import {ReportUtils} from "../../shared/utils/report-utils";
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import WorldMap from './world.json';

export interface GeoProps {
    dateRange: [Dayjs, Dayjs];
}

function Geo(props: GeoProps) {
    const {dateRange} = props;

    const [loading, setLoading] = useState(false);
    const [graphOptions, setGraphOptions] = useState({});
    const [zoom, setZoom] = useState(1.2);
    const [echartsIntance, setEchartsIntance] = useState(null);

    useEffect(() => {
        echarts.registerMap('world', WorldMap as any);
    }, []);

    useEffect(() => {
        if (dateRange[0].valueOf() !== dateRange[1].valueOf()) {
            console.log("load report!", dateRange);
        }
    }, [dateRange]);

    const zoomMap = (direction: 'in' | 'out') => {
        const newZoom = direction === 'in' ? zoom * 2 : zoom / 2;
        setZoom(newZoom);
        const roam = newZoom > 1.2 ? 'move' : 'false';
        (echartsIntance as any).setOption({ series: [{ zoom: newZoom, roam }] }, false);
    }

    const loadReport = useCallback(() => {
        setLoading(true);
        const reportType = KalturaReportType.mapOverlayCountry;
        const pager: KalturaPager = new KalturaPager({pageSize: 500, pageIndex: 1});
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
        const metrics = ["object_id","country","coordinates","count_plays"];

    const getMapConfig =(scatter: boolean) => {
            let config =  {
                textStyle: {
                    fontFamily: 'Lato',
                },
                grid: {
                    top: 24, left: 24, bottom: 24, right: 24, containLabel: true
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: '#ffffff',
                    borderColor: '#dadada',
                    borderWidth: 1,
                    padding: 8,
                    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                    textStyle: {
                        color: '#333333',
                        fontWeight: 'bold'
                    },
                    formatter: (params: any) => {
                        if (params.name && params.data && params.data.value && params.data.value.length === 3) {
                            let tooltip = '<span style="color: #999999">' + params.name + '</span><br/>' + params.seriesName + params.data.value[2];
                            if (params.seriesName === 'Avg. Drop Off') {
                                tooltip = tooltip + '%';
                            }
                            return tooltip;
                        } else {
                            return 'N/A';
                        }
                    }
                },
                visualMap: {
                    show: false,
                    min: 0,
                    max: 1000000,
                    left: 16,
                    center: [0, 0],
                    calculable: true,
                    inRange: {
                        color: ['#B4E9FF', '#2541B8']
                    }
                },
                series: []
            };
            if (scatter) {
                (config as any)['geo'] = {
                    map: 'world',
                    center: [0, 0],
                    top: 70,
                    zoom: 1.2,
                    roam: false,
                    label: {
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        areaColor: '#ebebeb',
                        borderColor: '#999999',
                        emphasis: {
                            label: {
                                show: true
                            },
                            areaColor: '#F8A61A'
                        }
                    },
                };
                (config as any).series = [
                    {
                        name: 'Plays',
                        type: 'scatter',
                        selectedMode: 'single',
                        coordinateSystem: 'geo',
                        animationDurationUpdate: 200,
                        animationEasingUpdate: 'cubicInOut',
                        data: [],
                        symbolSize: 12,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },

                        itemStyle: {
                            normal: {
                                color: '#f4e925',
                                shadowBlur: 5,
                                shadowColor: '#333'
                            },
                            emphasis: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        }
                    }
                ];
            } else {
                (config as any).series = [
                    {
                        name: '',
                        type: 'map',
                        mapType: 'world',
                        roam: false,
                        zoom: 1.2,
                        top: 40,
                        selectedMode: 'single',
                        animationDurationUpdate: 200,
                        animationEasingUpdate: 'cubicInOut',
                        itemStyle: {
                            areaColor: '#ebebeb',
                            borderColor: '#999999',
                            emphasis: {label: {show: true}, areaColor: '#F49616'}
                        },
                        data: []
                    }
                ];
                if ((config as any)['geo']) {
                    delete (config as any)['geo'];
                }
            }
            return config;
        }

        ReportService.getTable(config).then(
            result => {
                setLoading(false);
                let maxValue = 0;
                const tableData = ReportUtils.parseTableData(result as KalturaReportTable, metrics);
                const mapConfig = getMapConfig(false);
                tableData.forEach(data => {
                    const coords = data['coordinates'].split('/');
                    if (coords.length === 2) {
                        let value: any = [coords[1], coords[0]];
                        value.push(ReportUtils.parseFormattedValue(data["count_plays"]));
                        (mapConfig.series[0] as any).data.push({name: data.country, value});
                        if (parseInt(data["count_plays"]) > maxValue) {
                            maxValue = ReportUtils.parseFormattedValue(data["count_plays"]);
                        }
                    }
                });
                setGraphOptions(mapConfig);
            },
            error => {
                setLoading(false);
                debugger;
            }
        );

    }, [dateRange])

    const onChartReadyCallback = (chart: any) => {
        setEchartsIntance(chart);
        console.log(onChartReadyCallback);
    }

  return (
      <AreaBlocker loading={loading}>
          <span>Geo Location</span>
          <span onClick={loadReport} className="btn">Load report</span>
          <ReactECharts option={graphOptions} onChartReady={onChartReadyCallback}/>
          <span onClick={() => zoomMap('in')}>Zoom In</span>
          <span onClick={() => zoomMap('out')}>Zoom out</span>
      </AreaBlocker>

  );
}

export default Geo;
