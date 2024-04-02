import React, {useCallback, useEffect, useState} from 'react';
import './Features.css';
import {Dayjs} from "dayjs";
import AreaBlocker from "../../shared/area-blocker/AreaBlocker";
import allFeatures from '../../shared/filter/features.json';
import {
    KalturaPager,
    KalturaReportInterval,
    KalturaReportResponseOptions,
    KalturaReportTable,
    KalturaReportType
} from "kaltura-typescript-client/api/types";
import {ReportService} from "../../services/report-service";
import {DateFilterUtils} from "../../shared/utils/date-filter-utils";
import {analyticsConfig} from "../../configuration/analytics-config";
import {ReportUtils} from "../../shared/utils/report-utils";
import { ReactComponent as TopFeature} from '../../assets/TopFeature.svg';
import { ReactComponent as Feature} from '../../assets/Feature.svg';
import ePAccountEvents from '../../assets/epAccountEvents.png';
import epAccountCreateEvent from '../../assets/epAccountCreateEvent.png';
import epEventUsers from '../../assets/epEventUsers.png';
import {Button, TaskModal, ContentModal} from "@kaltura/ds-react-bits";
import {Box} from "@mui/material";
import {KalturaReportInputFilter} from "kaltura-typescript-client/api/types/KalturaReportInputFilter";

export interface HighlightsProps {
    dateRange: [Dayjs, Dayjs];
    apps: string;
    vertical: string;
    feature: string;
}

function Features(props: HighlightsProps) {
    const {dateRange, apps, vertical, feature} = props;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [topFeatures, setTopFeatures] = useState<any[]>([]);
    const [featureKeys, setFeatureKeys] = useState<any>({});

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalImageUrl, setModalImageUrl] = useState('');

    useEffect(() => {
        const keys: any = {};
        ["KMC", "KMS", "Analytics", "KME", "EP", "KAF", "Webcasting", "KPF", "Studio", "Player"].forEach(app => {
            if ((allFeatures as any)[app]) {
                (allFeatures as any)[app].forEach((feat: any) => {
                    keys[feat.value] = feat.label;
                })
            }
        })
        setFeatureKeys(keys);
    }, []);
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
        const pager: KalturaPager = new KalturaPager({pageSize: 500, pageIndex: 0});
        const config = {reportType, filter, pager, responseOptions, objectIds};
        const metrics = ["name","count_button_clicked","count_page_load"];

        const parseTableData = (tableData: any[]) => {
            let data: any[] = [];
            tableData.forEach((feature: any) => {
                if (feature.name !== "Unknown") {
                    data.push({
                        feature: feature.name,
                        count: parseInt(feature.count_button_clicked) + parseInt(feature.count_page_load)
                    })
                }
            });
            // merge duplicates
            let updatedData: any[] = [];
            data.forEach(feat => {
                let index = updatedData.findIndex(f => f.feature === feat.feature);
                if (index > -1) {
                    updatedData[index].count += feat.count;
                } else {
                    updatedData.push(feat);
                }
            })
            updatedData = updatedData.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0));
            setTopFeatures(updatedData);
        }

        ReportService.getTable(config).then(
            result => {
                setLoading(false);
                const tableData: any = ReportUtils.parseTableData(result as KalturaReportTable, metrics);
                parseTableData(tableData);
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

    const openModal = (feature: string) => {
        setModalTitle(featureKeys[feature]);
        setModalImageUrl(feature);
        setShowModal(true);
    }


    return (
        <div className={apps.length > 0 ? "features open" : "features"}>
            <AreaBlocker loading={loading}>
                <div className="container">
                    <span className="title">Top features</span>
                    {topFeatures.length > 0 && <div className="feature">
                        <TopFeature/>
                        <span className="rank" style={{color: 'black'}}>1</span>
                        <div className="featureValue">
                            <span
                                className="label">{featureKeys[topFeatures[0].feature] || topFeatures[0].feature}</span>
                            <span className="value">{ReportUtils.numberWithCommas(topFeatures[0].count)}</span>
                        </div>
                        <span className="link" onClick={() => openModal(topFeatures[0].feature)}>View</span>
                    </div>}
                    {topFeatures.length > 1 && <div className="feature">
                        <Feature/>
                        <span className="rank">2</span>
                        <div className="featureValue">
                            <span
                                className="label">{featureKeys[topFeatures[1].feature] || topFeatures[1].feature}</span>
                            <span className="value">{ReportUtils.numberWithCommas(topFeatures[1].count)}</span>
                        </div>
                        <span className="link" onClick={() => openModal(topFeatures[1].feature)}>View</span>
                    </div>}
                    {topFeatures.length > 2 && <div className="feature">
                        <Feature/>
                        <span className="rank">3</span>
                        <div className="featureValue">
                            <span className="label">{featureKeys[topFeatures[2].feature] || topFeatures[2].feature}</span>
                            <span className="value">{ReportUtils.numberWithCommas(topFeatures[2].count)}</span>
                        </div>
                        <span className="link" onClick={() => openModal(topFeatures[2].feature)}>View</span>
                    </div>}

                </div>
                {error && <TaskModal title="Error" actions={<>
                    <Button onClick={() => setError('')}>OK</Button>
                </>}>
                    <Box>{error}</Box>
                </TaskModal>}

                {showModal && <ContentModal style={{width: '815px', height: '546px'}} onClose={() => setShowModal(false)}>
                    <div className="modalContainer">
                        <span className="modalTitle">{modalTitle}</span>
                        {modalImageUrl === 'epAccountEvents' && <img style={{marginTop: '24px'}} src={ePAccountEvents} alt="epAccountEvents"/>}
                        {modalImageUrl === 'epEventUsers' && <img style={{marginTop: '24px'}} src={epEventUsers} alt="epEventUsers"/>}
                        {modalImageUrl === 'epAccountCreateEvent' && <img style={{marginTop: '24px'}} src={epAccountCreateEvent} alt="epAccountCreateEvent"/>}
                    </div>
                </ContentModal>}
            </AreaBlocker>
        </div>


    );
}

export default Features;
