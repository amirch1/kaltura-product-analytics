import {KalturaReportGraph, KalturaReportTable, KalturaReportTotal} from "kaltura-typescript-client/api/types";
import {analyticsConfig} from "../../configuration/analytics-config";
import {DateFilterUtils} from "./date-filter-utils";

export class ReportUtils {

    static parseTableData(table: KalturaReportTable, config: string[]): { [key: string]: string }[]  {
        // parse table columns
        let columns = table.header ? table.header.toLowerCase().split(analyticsConfig.valueSeparator) : [];
        const tableData: any[] = [];
        
        // parse table data
        if (table.data) {
            table.data.split(';').forEach(valuesString => {
                if (valuesString.length) {
                    let data: {[key: string]: any} = {};
                    valuesString.split(analyticsConfig.valueSeparator).forEach((value, index) => {
                        if (config.indexOf(columns[index]) > -1) {
                            data[columns[index]] = value;
                        }
                    });
                    tableData.push(data);
                }
            });
        }
        return tableData;
    }
    
    static parseTotals(totals: KalturaReportTotal): { [key: string]: string }  {
        const headers = totals.header.split(analyticsConfig.valueSeparator);
        const data = totals.data.split(analyticsConfig.valueSeparator);
        const parseData: any = {};
        headers.forEach((header, index) => {
            parseData[header] = (Math.round(parseFloat(data[index]) * 100) / 100).toString();
        });
        return parseData;
    }
    
    static parseGraphs(graphs: KalturaReportGraph[], metrics: string[]): any[] {
        let lineChartData: {[key: string]: any}[] = [];
        graphs.forEach((graph: KalturaReportGraph, graphIndex) => {
            if (metrics.indexOf(graph.id) === -1) {
                return;
            }
            const data = graph.data.split(';');
        
            data.forEach((value, index) => {
                if (value.length) {
                    const pair = value.split(analyticsConfig.valueSeparator);
                    if (pair.length > 1) {
                        const label = pair[0];
                        let name = DateFilterUtils.formatFullDateString(label);
                        let val: number = parseFloat(pair[1]);
                        if (isNaN(val)) {
                            val = 0;
                        }
                        if (graphIndex === 0) {
                            lineChartData.push({'date': name, [graph.id]: val});
                        } else {
                            let entry = lineChartData.find(obj => obj.date === name);
                            if (entry) {
                                entry[graph.id] = val;
                            }
                        }
                    }
                }
            });
        });
        return lineChartData;
    }
}

