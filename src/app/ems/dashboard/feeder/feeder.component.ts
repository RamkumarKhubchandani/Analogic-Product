import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import {FeederService} from './feeder.service';
import { INTERVAL_TIME } from '../../../data';
export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-feeder',
  templateUrl: './feeder.component.html',
  styleUrls: ['./feeder.component.scss']
})
export class FeederComponent implements OnInit {

  lineChartOptions: any;
  lineChartLabels: number[] = [];
  lineChartLegend = true;
  lineChartDataMP: any[];
  lineChartPowerDataPG1: any[];
  lineChartPowerDataPG2: any[];
  lineChartPowerQualityData: any[];
  lineChartDemandAnalysisData: any[];
  lineChartColors: Array<any> = [];

  feederData;

  headerWithColumns = []; /* {headers : 'Position',value:'position'},{headers : 'Name',value:'name'},{headers : 'Weight',value:'weight'},{headers : 'Symbol',value:'symbol'}*/
  displayedColumns: string[]; // = this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  loaded = true;
  loadedSpinner = true;
  isPaginatorLoading: boolean;
  Errormsg: boolean;
  errMessage: string;
  empty = true;

  machineName: string;
  plantFilter: string;
  departmentFilter: string;
  assemblyFilter: string;
  machinesFilter: string;
  summary: any;
  machineID: number;
  selectedEvent: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private feederService: FeederService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Records Per Page';
    setInterval(() => {
      if (this.selectedEvent) {
        this.onSelect(this.selectedEvent);
      }
    }, INTERVAL_TIME);
  }
  onSelect(e) {
    this.selectedEvent = e;
    this.loaded = true;
    this.empty = false;
    this.loadedSpinner = true;
    this.Errormsg = true;
    this.machineID = e.machineID;
    this.feederService.getName(e.machineID).subscribe(
      data => {
        console.log(data);
        this.getChartData(data['associated_name']);
        this.getColumnDetails(data['associated_name']);
        this.getMonitorDetails(data['associated_name']);
        this.getSummaryDetails(data['associated_name']);
      }
    );
  }

  getChartData(name: string) {
    this.feederService.getChartData(name).subscribe(data => {
      console.log('Chart-data----------', data);
      this.lineChartDataMP = this.feederService.getLineChartDataMP(data);
      this.lineChartPowerQualityData = this.feederService.getLineChartDataPowerQuality(data);
      const lchart = this.feederService.getLineChartOptions();
      this.lineChartOptions = lchart.options;
      this.lineChartColors = lchart.colors;
      this.lineChartLabels = lchart.labels;
    });
  }
  getMonitorDetails(name: string) {
    console.log(name);
    this.feederService.getMonitor(name).subscribe(
      data => {
        console.log(data);
        this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        this.dataSource.paginator = this.paginator;
        this.loadedSpinner = false;
      }
    );
  }
  getColumnDetails(name: string) {
    this.feederService.getColumn(name).subscribe(
      data => {
        console.log(data);
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
      }
    );

  }
  getSummaryDetails(name: string) {
    this.feederService.getSummary(name).subscribe(
      (data: any[]) => {
        console.log(data);
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = Number(data[key]);
            data[key] = value.toFixed(2);
          }
        }
        this.feederData = data;
      }
    );
  }
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];

