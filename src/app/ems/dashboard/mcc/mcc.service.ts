import { Injectable } from '@angular/core';
import { RestApi } from '../../../core/services/rest.service';
import { map, orderBy } from 'lodash';
import { GlobalErrorHandler } from '../../../core/services/error-handler';

@Injectable()
export class MccService {
  barLabel = [];
  lineLabel = [];
  constructor(private rest: RestApi) { }
  getMonitor(machineId: string) {
    return this.rest.get(`generic/MonitoringDashboard/${machineId}`);
  }
  getColumn(machineId: string) {
    return this.rest.get(`generic/genericColumns/${machineId},all`);

  }
  getSummary(machineId: string) {
    return this.rest.get(`generic/SummaryDashboard/${machineId}`);
  }
  getName(machineId: number) {
    return this.rest.get(`config/associativename/${machineId}`);

  }
  getChartData(machineId: string) {
    return this.rest.get(`generic/genericChartDataDashboard/${machineId}`)
  }

  getLineChartDataMP(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    const x4: string[] = [];
    const x5: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      // x1[start + '-' + end] = item['energy_consumption'];
      x1[start] = item['energy_consumption'];
      x3.push(item['voltage']);
      x4.push(item['current']);
      x5.push(item['frequency']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Vrms' },
      { data: [...x4], label: 'Irms' },
      { data: [...x5], label: 'Frequency' }
    ];
  }

  getLineChartDataPowerPG1(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      x1[start] = item['energy_consumption'];
      x3.push(item['apparent_power']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Apparent Power' },
    ];
  }
  getLineChartDataPowerPG2(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    const x4: string[] = [];
    const x5: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      x1[start] = item['energy_consumption'];
      x3.push(item['voltage']);
      x4.push(item['current']);
      x5.push(item['frequency']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Vrms' },
      { data: [...x4], label: 'Irms' },
      { data: [...x5], label: 'Frequency' }
    ];
  }
  getLineChartDataPowerQuality(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    const x4: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      x1[start] = item['energy_consumption'];
      x3.push(item['power_factor']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Power Factor' },
    ];
  }
  getLineChartDataDemandAnalysis(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    const x4: string[] = [];
    const x5: string[] = [];
    this.lineLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      x1[start] = item['energy_consumption'];
      x3.push(item['demand']);
      x4.push(item['average_demand']);
      this.lineLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Demand' },
      { data: [...x4], label: 'Average Demand' },
    ];
  }
  getLineChartOptions = () => {
    return {
      colors: [
        {
          borderColor: '#0066ff'
        },
        {
          borderColor: '#d9534f'
        },
        {
          borderColor: 'green'
        }
      ],
      labels: this.lineLabel, // this.getHours(24),
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Production Data',
              fontColor: '#3e6ceb',
              min: 0
            }

          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time',
              fontColor: '#3e6ceb',
              min: 0
            }
          }]
        }
      }
    };
  }

  getBarChartData(data) {
    const x1: number[] = this.getEmptyArray(24),
      x2: number[] = this.getEmptyArray(24);
    const x3: string[] = [];
    this.barLabel.length = 0;
    map(data, (item: any) => {
      const start = new Date(item['start_time']).getHours();
      const end = new Date(item['end_time']).getHours();
      x1[start] = item['energy_consumption'];
      x3.push(item['total_energy_consumed']);
      this.barLabel.push(start + '-' + end);
    });
    return [
      { data: [...x3], label: 'Energy Consumption' }
    ];

  }

  getChartOptions = () => {
    return {
      colors: [
        {
          backgroundColor: '#0066ff'
        },
        {
          backgroundColor: '#d9534f'
        }
      ],
      labels: this.barLabel, // this.getHours(24),
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Energy Consumption',
              fontColor: '#3e6ceb',
              min: 0
            }

          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time',
              fontColor: '#3e6ceb',
              min: 0
            }
          }]
        }
      }
    };
  }

  private getEmptyArray = n => Array.from(new Array(n), (x, i) => 0);

  private getHours = n => Array.from(new Array(n), (x, i) => i);
}


