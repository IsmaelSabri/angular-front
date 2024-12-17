import { Injectable } from "@angular/core";
import Highcharts from 'highcharts';





@Injectable({
    providedIn: 'root'
})
export class ChartService {

    public drawChart(id: string, type: string, title: string, data: any, name: string): any {
        const chart = Highcharts.chart(id, {
            chart: {
                type: type,
            },
            title: {
                text: title,
            },
            credits: {
                enabled: false,
            },
            legend: {
                enabled: false,
            },
            yAxis: {
                title: {
                    text: null,
                }
            },
            xAxis: {
                type: 'category',
            },
            tooltip: {
                headerFormat: `<div>Dia: {point.key}</div>`,
                pointFormat: `<div>{series.name}: {point.y}</div>`,
                shared: true,
                useHTML: true,
            },
            series: [{
                name: name,
                data,
            }],
        } as any);
        return chart;
    }
}