import {
    KalturaFilterPager, KalturaPager, KalturaReportResponseOptions,
    KalturaReportType, ReportGetGraphsAction, ReportGetTableAction, ReportGetTotalAction
} from "kaltura-typescript-client/api/types";
import {KalturaClient} from "kaltura-typescript-client";
import {analyticsConfig} from "../configuration/analytics-config";
import {KalturaReportInputFilter} from "kaltura-typescript-client/api/types/KalturaReportInputFilter";

export interface ReportConfig {
    pager?: KalturaPager;
    filter: KalturaReportInputFilter;
    responseOptions: KalturaReportResponseOptions;
    reportType: KalturaReportType,
    sortOrder?: number;
    objectIds?: string;
}

export class ReportService {

    static getTable(config: ReportConfig) {
        const {filter, pager, responseOptions, reportType, objectIds} = config;
        const client = new KalturaClient({clientTag: 'product-analytics', endpointUrl: analyticsConfig.baseUrl});
        const urlParams = new URLSearchParams(window.location.search);
        const ks = urlParams.get('ks') || '';
        client.setDefaultRequestOptions({ks});
        const request =
            {
                reportType,
                pager: pager as KalturaFilterPager,
                reportInputFilter: filter,
                responseOptions
            }
        if (objectIds) {
            Object.assign(request, {objectIds});
        }
        return client.request(new ReportGetTableAction(request));
    }

    static getGraph(config: ReportConfig) {
        const {filter, responseOptions, reportType, objectIds} = config;
        const client = new KalturaClient({clientTag: 'product-analytics', endpointUrl: analyticsConfig.baseUrl});
        const urlParams = new URLSearchParams(window.location.search);
        const ks = urlParams.get('ks') || '';
        client.setDefaultRequestOptions({ks});
        const request =
            {
                reportType,
                reportInputFilter: filter,
                responseOptions
            }
        if (objectIds) {
            Object.assign(request, {objectIds});
        }
        return client.request(new ReportGetGraphsAction(request));
    }

    static getTotal(config: ReportConfig) {
        const {filter, responseOptions, reportType, objectIds} = config;
        const client = new KalturaClient({clientTag: 'product-analytics', endpointUrl: analyticsConfig.baseUrl});
        const urlParams = new URLSearchParams(window.location.search);
        const ks = urlParams.get('ks') || '';
        client.setDefaultRequestOptions({ks});
        const request =
            {
                reportType,
                reportInputFilter: filter,
                responseOptions
            }
        if (objectIds) {
            Object.assign(request, {objectIds});
        }
        return client.request(new ReportGetTotalAction(request));
    }

}
