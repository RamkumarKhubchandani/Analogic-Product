import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";

import {AlarmReportService} from "./alarm-report.service";

export interface PeriodicElement {
  position: number;
  name: string;  
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-alarm-report',
  templateUrl: './alarm-report.component.html',
  styleUrls: ['./alarm-report.component.scss']
})



export class AlarmReportComponent implements OnInit {
  headerWithColumns = [{headers : "alarmName",value : "alarmName"},{headers : "alarmIntime",value : "alarmIntime"},{headers : "alarmOntime",value : "alarmOntime"}]; //{headers : "Position",value:"position"},{headers : "Name",value:"name"},{headers : "Weight",value:"weight"},{headers : "Symbol",value:"symbol"}
  displayedColumns: string[] = this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();


  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  datasetLength: number;
  loaded: boolean = true;
  loadedspinner: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;
  data: any[] = [];
  plantOptions: any[];
  plantName: number;
  defaultValue: number;
  reportVal: any;
  pdfData: any[] = [];
  pdfReady: boolean;

  highlightForTable: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private alarmservice  : AlarmReportService) { }

  ngOnInit() {
  }

  onSelect(e) {
    this.reportVal = { ...e.values, type: "production" };
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = e.reportValue["plant"];
    this.department = e.reportValue["department"];
    this.assembly = e.reportValue["assembly"];
    this.machineId = e.reportValue["machine"];
    this.from = this.alarmservice.formatDate(e.reportValue["from"]);
    this.to = this.alarmservice.formatDate(e.reportValue["to"]);
    this.interval = e.reportValue["interval"];  

    this.alarmservice.getName(e.reportValue["machine"]).subscribe(
      data => {
          console.log(data);
          
          this.getAlarminfo(data["associated_name"],this.from,this.to,this.interval);    
          // this.getColumnDetails(data["associated_name"]);
          // this.getMonitorDetails(data["associated_name"]);    
          // this.getSummaryDetails(data["associated_name"]);
      }
    )
    // this.getProductionDetails(
    //   this.plant,
    //   this.department,
    //   this.assembly,
    //   this.machineId,
    //   this.from,
    //   this.to,
    //   this.interval
    // );
  }

  getAlarminfo(machineName,
    from,
    to,
    interval){
      this.alarmservice.getAlarmInfo(machineName,from,to,interval).subscribe(
        data => {
          console.log(data);
         this.dataSource = new MatTableDataSource<PeriodicElement>(data);
         this.dataSource.paginator = this.paginator;
         this.loadedspinner = false;
        }
      );   

    }

}
