import React, {useCallback, useEffect, useState} from 'react';
import './Geo.css';
import {Dayjs} from "dayjs";
import AreaBlocker from "../../shared/area-blocker/AreaBlocker";
import {
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
import {Button, TaskModal} from "@kaltura/ds-react-bits";
import {Box} from "@mui/material";
import {KalturaReportInputFilter} from "kaltura-typescript-client/api/types/KalturaReportInputFilter";
import { Minus24Icon, Plus16Icon } from '@kaltura/ds-react-icons';

export interface GeoProps {
    dateRange: [Dayjs, Dayjs];
    apps: string;
    vertical: string;
    feature: string;
}

function Geo(props: GeoProps) {
    const {dateRange, apps, vertical, feature} = props;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
        const reportType = KalturaReportType.applicationEventsMapOverlayCountry;
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
        const metrics = ["object_id","country","coordinates","count_button_clicked","count_page_load"];
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
                            let tooltip = '<span style="color: #999999">' + params.name + '</span><br/>' + params.seriesName + ReportUtils.numberWithCommas(params.data.value[2]);
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
                    max: 50000,
                    left: 16,
                    center: [0, 0],
                    calculable: true,
                    inRange: {
                        color: ['#FF9DFF', '#FFD357']
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
                tableData.forEach((point: any) => {
                    point['count'] = parseInt(point["count_button_clicked"]) + parseInt(point["count_page_load"]);
                })
                tableData.forEach(data => {
                    const coords = data['coordinates'].split('/');
                    if (coords.length === 2) {
                        let value: any = [coords[1], coords[0]];
                        value.push(ReportUtils.parseFormattedValue(data["count"]));
                        (mapConfig.series[0] as any).data.push({name: data.country, value});
                        if (parseInt(data["count"]) > maxValue) {
                            maxValue = ReportUtils.parseFormattedValue(data["count"]);
                        }
                        mapConfig.visualMap.max = maxValue;
                    }
                });
                setGraphOptions(mapConfig);
            },
            error => {
                setLoading(false);
                setError(error?.message || 'An error occurred');
            }
        );

    }, [dateRange, apps, feature, vertical])

    const onChartReadyCallback = (chart: any) => {
        setEchartsIntance(chart);
        console.log(onChartReadyCallback);
    }

    useEffect(() => {
        if (apps.length) {
            loadReport();
        }
    }, [dateRange, apps, vertical, feature, loadReport]);

  return (
      <div className={apps.length > 0 ? "geo open" : "geo"}>
          <AreaBlocker loading={loading}>
              <div className="header">
                  <span className="title">Countries</span>
              </div>
              {apps.length > 0 && <ReactECharts option={graphOptions} onChartReady={onChartReadyCallback}/>}
              {apps.length > 0 && <div className="zoom">
                  <div className="zoomBtn" onClick={() => zoomMap('out')}>
                      <Minus24Icon/>
                  </div>
                  <div className="zoomBtn" onClick={() => zoomMap('in')}>
                      <Plus16Icon/>
                  </div>
              </div>}

              {error && <TaskModal title="Error" actions={<>
                  <Button onClick={() => setError('')}>OK</Button>
              </>}>
                  <Box>{error}</Box>
              </TaskModal>}
          </AreaBlocker>
      </div>
  );
}

export default Geo;
