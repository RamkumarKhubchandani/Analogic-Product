import { Component, OnInit,ViewChild } from '@angular/core';

import {AirCompressorReportsService} from "./air-compressor-reports.service";

import { Router } from "@angular/router";

import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";

export interface PeriodicElement {
  position: number;
  name: string;  
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-air-compressor-reports',
  templateUrl: './air-compressor-reports.component.html',
  styleUrls: ['./air-compressor-reports.component.scss']
})
export class AirCompressorReportsComponent implements OnInit {

  airData ={};
  //  {
  //   "total_energy_consumed" : "1418.0",
  //   "specific_power_consumption" : "23.70243248",
  //   "total_air_compressed" : "647.0"
  // };
  headerWithColumns = []; //{headers : "Position",value:"position"},{headers : "Name",value:"name"},{headers : "Weight",value:"weight"},{headers : "Symbol",value:"symbol"}
  displayedColumns: string[] ;//= this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
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
  loadedSpinner: boolean = false;
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

  constructor(private reportService : AirCompressorReportsService,private router : Router) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  goTo(route: string) {
    this.router.navigate([`machinedetail/${route}`]);
  }

  onSelect(e) {
    this.reportVal = { ...e.values, type: "production" };
    this.loadedSpinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = e.reportValue["plant"];
    this.department = e.reportValue["department"];
    this.assembly = e.reportValue["assembly"];
    this.machineId = e.reportValue["machine"];
    this.from = this.reportService.formatDate(e.reportValue["from"]);
    this.to = this.reportService.formatDate(e.reportValue["to"]);
    this.interval = e.reportValue["interval"];

    this.reportService.getName(e.reportValue["machine"]).subscribe(
      data => {
          console.log(data);
          this.getSummaryDetail(
                  this.plant,
                  this.department,
                  this.assembly,
                  data["associated_name"],
                  this.from,
                  this.to,
                  this.interval
          );
          this.getColumnDetails(data["associated_name"]);
          this.getMonitorDetails(data["associated_name"],this.from,this.to,this.interval);    
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

  getSummaryDetail(
    plant,
    department,
    assembly,
    machineName,
    from,
    to,
    interval
  ){
    this.reportService.getSummary(machineName,from,to,interval).subscribe(
      data => {
        console.log(data);        
        this.airData = data;
      }
    );   
  }
  getMonitorDetails(machineName,
    from,
    to,
    interval){
    console.log(name);
    this.reportService.getMonitor(machineName,from,to,interval).subscribe(
      data => {
        console.log(data);
       this.dataSource = new MatTableDataSource<PeriodicElement>(data);
       this.dataSource.paginator = this.paginator;
       this.loadedSpinner = false;
      }
    );   

  }
  getColumnDetails(name: string){
    this.reportService.getColumn(name).subscribe(
      data => {
        console.log(data);
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
      }
    );   

  }

}
