import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { PccReportService } from './pcc-report.service';
import { DASHBOARD_BOX_DETAILS } from '../../../data';
import {NewPdfComponent} from '../../../new-pdf/new-pdf.component';
export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-pcc-report',
  templateUrl: './pcc-report.component.html',
  styleUrls: ['./pcc-report.component.scss']
})
export class PccReportComponent implements OnInit {
  mccReportSummaryData = '';
  btnRef: ElementRef;

  DASHBOARD_BOX_DETAILS  = DASHBOARD_BOX_DETAILS ;
  headerWithColumns = []; //{headers : 'Position',value:'position'},{headers : 'Name',value:'name'},{headers : 'Weight',value:'weight'},{headers : 'Symbol',value:'symbol'}
  displayedColumns: string[] ; // = this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  monitoredData;
  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  datasetLength: number;
  loaded = true;
  loadedspinner = false;
  Errormsg = true;
  errMessage: string;
  data: any[] = [];
  plantOptions: any[];
  plantName: number;
  defaultValue: number;
  reportVal: any;
  // pdfData: any[] = [];
  pdfReady: boolean;

  highlightForTable: string;
  pdfData = {
    REPORT_TYPE: 'simpleReport',
    // DASHBOARD_BOX_DETAILS: this.DASHBOARD_BOX_DETAILS.MCC_DASHBOARD,
    reportFileName : 'PCC_Report',
    reportPaperSize : 'A2',
    reportLandscap : false
  };

  @ViewChild('pdfContainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private pccReportService: PccReportService, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Records Per Page';
  }
  onSelect(e) {
    this.btnRef = e.downloadPdfBtnRef;
    this.reportVal = { ...e.values, type: 'production' };
    this.loadedspinner = true;
    this.loaded = true;
    this.Errormsg = true;
    this.plant = e.reportValue['plant'];
    this.department = e.reportValue['department'];
    this.assembly = e.reportValue['assembly'];
    this.machineId = e.reportValue['machine'];
    this.from = this.pccReportService.formatDate(e.reportValue['from']);
    this.to = this.pccReportService.formatDate(e.reportValue['to']);
    this.interval = e.reportValue['interval'];

    this.pdfData['plantDetails'] = {
      plant: this.reportVal.plant,
      department: this.reportVal.department,
      machine: this.reportVal.machine,
      from: this.reportVal.from,
      to: this.reportVal.to,
      interval: this.reportVal.interval
    };

    this.pccReportService.getName(e.reportValue['machine']).subscribe(
      data => {
          console.log(data);
          this.getSummaryDetail(
                  this.plant,
                  this.department,
                  this.assembly,
                  data['associated_name'],
                  this.from,
                  this.to,
                  this.interval
          );
          this.getColumnDetails(data['associated_name']);
          this.getMonitorDetails(data['associated_name'], this.from, this.to, this.interval, this.btnRef);
      }
    );
  }

  getSummaryDetail(
    plant,
    department,
    assembly,
    machineName,
    from,
    to,
    interval
  ) {
    this.pccReportService.getSummary(machineName, from, to, interval).subscribe(
      data => {
        console.log(data);
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = Number(data[key]);
            data[key] = value.toFixed(2);
          }
        }
        this.mccReportSummaryData = data;
        this.pdfData['summaryData'] = [
          [
            {
              TITLE: 'Monitoring Parameters',
              boxdata: {
                'Voltage' : this.mccReportSummaryData['voltage'],
                'Current': this.mccReportSummaryData['current'],
                'Frequency': this.mccReportSummaryData['frequency']
              }
            },
            {
              TITLE: 'Power Data',
              boxdata: {
                'Active Power': this.mccReportSummaryData['active_power'],
                'Reactive Power': this.mccReportSummaryData['reactive_power'],
                'Apparant Power': this.mccReportSummaryData['apparent_power']
              }
            }
          ],
          [
            {
              TITLE: 'Phasewise Data',
              boxdata: {
                'R-Phase Load': this.mccReportSummaryData['power_factor'],
                'Y-Phase Load': this.mccReportSummaryData['thd'],
                'B-Phase Load': this.mccReportSummaryData['thd'],
              }
            },
            {
              TITLE: 'Demand Data',
              boxdata: {
                'Average Demand': this.mccReportSummaryData['average_demand'],
                'Peak Demand': this.mccReportSummaryData['peak_demand'],
                'Demand': this.mccReportSummaryData['demand']
              }
            }
          ]
        ];
       }
    );
  }
  getMonitorDetails(machineName,
    from,
    to,
    interval, btnRef) {
    console.log(name);
    this.pccReportService.getMonitor(machineName, from, to, interval).subscribe(
      data => {
        console.log(data);
        let temp = {};
        const pdfMonitoringRowData = [];
        this.monitoredData = data;
        this.monitoredData.map((row) => {
          this.displayedColumns.map((col) => {
            for (const key in row) {
              if (row.hasOwnProperty(key)) {
                if (key === col) {
                  temp[key] = row[key];
                }
              }
            }
          });
          pdfMonitoringRowData.push(temp);
          temp = {};
        });
       this.dataSource = new MatTableDataSource<PeriodicElement>(data);
       this.dataSource.paginator = this.paginator;
       this.loadedspinner = false;
       this.pdfData['monitoringDataRow'] = pdfMonitoringRowData;
        btnRef._elementRef.nativeElement.disabled = false;
        btnRef._elementRef.nativeElement.addEventListener('click', this.createComponent.bind(this));
      }
    );

  }
  getColumnDetails(name: string) {
    this.pccReportService.getColumn(name).subscribe(
      data => {
        console.log(data);
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
        console.log(this.displayedColumns);

        this.pdfData['monitoringDataColumn'] = this.headerWithColumns;
      }
    );

  }
  createComponent() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(NewPdfComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.getPdfData(this.pdfData);
    setTimeout(() =>  {
      componentRef.destroy();
     }, 2500);
  }
}
