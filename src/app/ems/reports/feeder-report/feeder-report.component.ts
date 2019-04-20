import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatButton } from '@angular/material';
import { FeederReportService } from './feeder-report.service';
import { NewPdfComponent } from '../../../new-pdf/new-pdf.component';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-feeder-report',
  templateUrl: './feeder-report.component.html',
  styleUrls: ['./feeder-report.component.scss']
})
export class FeederReportComponent implements OnInit {
  mccReportSummaryData = '';
  btnRef: ElementRef;


  monitoredData;
  headerWithColumns = []; //{headers : 'Position',value:'position'},{headers : 'Name',value:'name'},{headers : 'Weight',value:'weight'},{headers : 'Symbol',value:'symbol'}
  displayedColumns: string[]; // = this.headerWithColumns.map(row => row.value); //['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>();

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
  // pdfData = {} ;
  pdfData = {
    REPORT_TYPE: 'simpleReport',
    // DASHBOARD_BOX_DETAILS: this.DASHBOARD_BOX_DETAILS.MCC_DASHBOARD,
    reportFileName : 'Feeder_Report',
    reportPaperSize : 'A2',
    reportLandscap : false
  };

  @ViewChild('pdfContainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private feederReportService: FeederReportService, private resolver: ComponentFactoryResolver) {
  }

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
    this.from = this.feederReportService.formatDate(e.reportValue['from']);
    this.to = this.feederReportService.formatDate(e.reportValue['to']);
    this.interval = e.reportValue['interval'];

    this.pdfData['plantDetails'] = {
      plant: this.reportVal.plant,
      department: this.reportVal.department,
      machine: this.reportVal.machine,
      from: this.reportVal.from,
      to: this.reportVal.to,
      interval: this.reportVal.interval
    };
    this.feederReportService.getName(e.reportValue['machine']).subscribe(
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
    this.feederReportService.getSummary(machineName, from, to, interval).subscribe(
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
                'Load': this.mccReportSummaryData['kwh']
              }
            },
            {
              TITLE: 'Power Quality Data',
              boxdata: {
                'Power Data': this.mccReportSummaryData['power_factor'],
                'THD': this.mccReportSummaryData['thd'],
                '': ''
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
    this.feederReportService.getMonitor(machineName, from, to, interval).subscribe(
      data => {
        this.monitoredData = data;
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
        console.log(`mcc_monitoring_Data >> ${JSON.stringify(data)}`);
        this.dataSource = new MatTableDataSource<PeriodicElement>(data);
        this.dataSource.paginator = this.paginator;
        this.loadedspinner = false;
        this.pdfData['monitoringDataRow'] = pdfMonitoringRowData;
        btnRef._elementRef.nativeElement.disabled = false;
        btnRef._elementRef.nativeElement.addEventListener('click', this.createComponent.bind(this));
      }
    );

  }

  giveAlert(event) {
    alert(`test >> ${this.pdfData}`);
  }
  getColumnDetails(name: string) {
    this.feederReportService.getColumn(name).subscribe(
      data => {
        console.log(`mcc_monitoring_data >> ${JSON.stringify(data)}`);
        this.headerWithColumns = data;
        this.displayedColumns = this.headerWithColumns.map(row => row.value);
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
