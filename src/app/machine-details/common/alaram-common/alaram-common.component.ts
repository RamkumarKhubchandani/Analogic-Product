import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, MatTableDataSource ,MatPaginatorIntl} from "@angular/material";
import { Subscription } from "rxjs/Subscription";
import { AutoLogoutService} from './../../../auto-logout.service';
import * as moment from "moment";

import {AlaramCommonService} from "./alaram-common.service"

@Component({
  selector: 'app-alaram-common',
  templateUrl: './alaram-common.component.html',
  styleUrls: ['./alaram-common.component.scss']
})
export class AlaramCommonComponent implements OnInit {

  chartColors: Array<any> = [];
  chartData: any[];
  chartOptions: any = {};
  displayedColumns = [];
  empty: boolean = true;
  errMessage: string;
  loaded: boolean;
  machine;
  subscriber: Subscription;
  tableData;
  machineID:number;
  totalSecond: string;

  constructor(private alarm: AlaramCommonService,private _intl:MatPaginatorIntl,private logout:AutoLogoutService) {
    this.setupChart();
    this.displayedColumns = this.alarm.getTableColumns();
  }

  ngOnInit() { localStorage.setItem('lastAction', Date.now().toString());}

  ngOnDestroy() {
    if (this.subscriber) this.subscriber.unsubscribe();
  }

  onSelect(e) {
    this.loaded = false;
    this.empty = false;
    this.machineID=e.machineID;
    this.alarm.getName(e.machineID).subscribe(
      data => {
        this.getProductAlarmDetails(data["associated_name"]);
          console.log(data);
          
      }
    )
    

  }

  private getProductAlarmDetails(name:string) {
    if (undefined !== name) {
      this.subscriber = this.alarm
        .getProductAlarmDetails(name)
        .subscribe(
        
          data => {
            this.tableData = this.alarm.getTableData(data);   
            let sc =0;
            data.map(row => {
                 sc = sc + row.alarmOntime
            })         
            this.totalSecond = moment().startOf('day')
            .seconds(sc)
            .format('H:mm:ss');
            },
          err => this.handleError(err)
        );

      this.subscriber = this.alarm
        .getProductAlarmCount(name)
        .subscribe(
          data => this.setChartData(data),
          err => this.handleError(err)
        );
    } else this.handleError("");
  }

  private handleError(err) {
    this.reset();
    this.empty = true;
    this.errMessage = this.alarm.getErrorMessage(0);
    this.alarm.throwError(err);
  }

  private setupChart() {
    const chart = this.alarm.getChartOptions();
    this.chartOptions = chart.options;
    this.chartColors = chart.colors;
  }

  private setChartData(data) {
    const { chart, empty, errMessage } = this.alarm.getChartData(data);
    this.empty = empty;
    this.chartData = chart;
    this.errMessage = errMessage;
    this.reset();
  }

  private reset() {
    this.loaded = true;
  }

}
