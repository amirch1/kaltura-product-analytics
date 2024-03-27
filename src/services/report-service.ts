import {KalturaEndUserReportInputFilter, KalturaFilterPager, KalturaPager, KalturaReportResponseOptions,
    KalturaReportType, ReportGetGraphsAction, ReportGetTableAction, ReportGetTotalAction} from "kaltura-typescript-client/api/types";
import {KalturaClient} from "kaltura-typescript-client";
import {analyticsConfig} from "../configuration/analytics-config";

export interface ReportConfig {
  pager?: KalturaPager;
  filter: KalturaEndUserReportInputFilter;
  responseOptions: KalturaReportResponseOptions;
  reportType: KalturaReportType,
  sortOrder?: number;
}

export class ReportService {

  static getTable(config: ReportConfig) {
    const {filter, pager, responseOptions, reportType} = config;
    const client = new KalturaClient({clientTag: 'product-analytics', endpointUrl: analyticsConfig.baseUrl});
    const urlParams = new URLSearchParams(window.location.search);
    const ks =  urlParams.get('ks') || analyticsConfig.ks;
    client.setDefaultRequestOptions({ks});
    return client.request(
        new ReportGetTableAction({
          reportType,
          pager: pager as KalturaFilterPager,
          reportInputFilter: filter,
          responseOptions
        })
    )
  }

  static getGraph(config: ReportConfig) {
    const {filter, responseOptions, reportType} = config;
    const client = new KalturaClient({clientTag: 'product-analytics', endpointUrl: analyticsConfig.baseUrl});
    const urlParams = new URLSearchParams(window.location.search);
    const ks =  urlParams.get('ks') || analyticsConfig.ks;
    client.setDefaultRequestOptions({ks});
    return client.request(
        new ReportGetGraphsAction({
          reportType,
          reportInputFilter: filter,
          responseOptions
        })
    )
  }

  static getTotal(config: ReportConfig) {
    const {filter, responseOptions, reportType} = config;
    const client = new KalturaClient({clientTag: 'product-analytics', endpointUrl: analyticsConfig.baseUrl});
    const urlParams = new URLSearchParams(window.location.search);
    const ks =  urlParams.get('ks') || analyticsConfig.ks;
    client.setDefaultRequestOptions({ks});
    return client.request(
        new ReportGetTotalAction({
          reportType,
          reportInputFilter: filter,
          responseOptions
        })
    )
  }

}
