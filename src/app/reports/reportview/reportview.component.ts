import { Component, AfterViewInit, ViewChild, OnInit, Input } from "@angular/core";
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from "@angular/material";
import { Subscription } from "rxjs";
import { ReportsService } from "../reports.service";
import { GlobalErrorHandler } from "../../core/services/error-handler";


declare var jsPDF: any;
@Component({
  selector: 'app-reportview',
  templateUrl: './reportview.component.html',
  styleUrls: ['./reportview.component.scss']
})


export class ReportviewComponent implements AfterViewInit {

  compareProperty = {
    type: "semi",
    label: "Speed",
    append: "km/hr",
    min: 0,
    max: 100,
    cap: 'round',
    thick: 15,
    size: 200
  }

  objectKeys = Object.keys;
  chartAtributes: any[];
  chartReportData:any[]=[];
  piechartReportData:any[]=[];
  doughnutchartReportData:any[]=[];
  guagechartReportData = []=[];
  public PieChartOptions: any = {
    legend: { position: 'right' }
  };
  public ChartOptions: any = {
    scaleShowValues: true,
    responsive: true,
    elements: {
      line: { tension: 0 }
    },
    scales: {
      xAxes: [{
        ticks: {
          autoSkip: false,
        }
      }]
    }
  };  // for charts

  public ChartOptionsForSummary: any = {

    responsive: true,
    scales: {
      xAxes: [
        {
          barPercentage: 0.2
        }
      ],
      yAxes: [
        {
          ticks: {
            min: 0
          }
        }
      ]
    }
  }

  ChartArray: any[] = [];
  ChartName: any[] = [];
  plant: number;
  department: number;
  assembly: number;
  machineId: number;
  from: string;
  to: string;
  interval: number;
  reportId: number;
  oeeType: any;
  shift: any;

  parameterList = [];
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  paramListForMonitoring = [];
  paramListForSummary = [];
  Charts: any = { pie: [], lineBar: [], guage: [] };
  chartsName: any = { pie: [], lineBar: [], guage: [] };
  // Charts: any = { pie: [], lineBar: [] };
  guageChart = [];
  keyForMonitoring = [];
  keysForSummary = [];
  highlight: string = '';
  datasetLength: number;
  dataSource1 = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  subscriber: Subscription;
  reportVal: any;
  pdfData: any;
  pdfDataForSummary: any;
  chartDetails: any[];
  chartResponse: any[];
  pdfReady: boolean;
  tableType1 = "monitoring";
  tableType2 = "summary";
  reportHeading: string;
  HeadersForMonitoring = [];
  HeadersForSummary = [];

  loadMonitoring: boolean = true;
  loadSummary: boolean = true;
  loadHighlight = true;
  showChart = true;
  loading: boolean = false;
  Errormsg: boolean = true;
  errMessage: string;



  //guage chart options
  // gaugeType = 'semi';
  // gaugeAppendText = '%';
  // gaugemin = 0;
  // gaugemax = 100;
  // gaugecap = 'round';
  // gaugethick = 15;
  // guagesize = 200;

  thresholdConfig = {
    '0': { color: 'red', font: '5px' },
    '50': { color: 'orange' },
    '80': { color: 'green', font: '5px' }
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private rs: ReportsService, private error: GlobalErrorHandler, private _intl: MatPaginatorIntl) {
  }
  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Records Per Page";
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  downloadCanvas(event) {
    if (this.ChartArray.length != 0) {
      while (this.ChartArray.length > 0) {
        this.ChartArray.pop();
      }
    } //empty

    if (this.ChartName.length != 0) {
      while (this.ChartName.length > 0) {
        this.ChartName.pop();
      }
    } //empty

    var canvas = document.getElementsByTagName('canvas');
    for (let i = 0; i < canvas.length; i++){
      var imgData = document.getElementsByTagName('canvas')[i].toDataURL('image/png');
      this.ChartArray.push(imgData);
    }

    for (let key of this.objectKeys(this.Charts)) {
      for (let chart of this.Charts[key]) {
        this.ChartName.push(chart.chartName)
      }
    }
    console.log(this.ChartArray);

  }


  onSelect(event: any) {
    this.loading = true;
    this.pdfReady = false;
    this.Errormsg = true;
    this.loadMonitoring = true;
    this.loadSummary = true;
    this.loadHighlight = true;
    this.showChart = true;
    this.reportHeading = event.reportValue.reportName.report_name;
    this.reportVal = { ...event.values, type: "dynamic", reportName: this.reportHeading.charAt(0).toUpperCase() + this.reportHeading.slice(1) };
    this.plant = event.reportValue["plant"];
    this.department = event.reportValue["department"];
    this.assembly = event.reportValue["assembly"];
    this.machineId = event.reportValue["machine"];
    this.from = this.rs.formatDate(event.reportValue["from"]);
    this.to = this.rs.formatDate(event.reportValue["to"]);
    this.interval = event.reportValue["interval"];
    this.reportId = event.reportValue.reportName.report_id;
    this.shift = event.reportValue["shift"];
    this.oeeType = event.reportValue["filterType"];
    this.ChartDetails(this.reportId, this.machineId);
    this.headersValueForSummary(this.reportId, this.tableType2);
    this.getHighlight();
    this.headersValueForMonitoring(this.reportId, this.tableType1);
  }

  //******************************************Summary Table*********************************
  private headersValueForSummary(id, type) {

    this.rs.getHeadersForSummary(id, type).subscribe(data => {
      if (this.paramListForSummary.length != 0) {
        while (this.paramListForSummary.length > 0) {
          this.paramListForSummary.pop();
        }
      } //empty
      if (this.keysForSummary.length != 0) {
        while (this.keysForSummary.length > 0) {
          this.keysForSummary.pop();
        }
      } //empty
      if (this.HeadersForSummary.length != 0) {
        while (this.HeadersForSummary.length > 0) {
          this.HeadersForSummary.pop();
        }
      } //empty
      if (this.pdfDataForSummary !== undefined) {
        while (this.pdfDataForSummary.length > 0) {
          this.pdfDataForSummary.pop();
        }
      } //empty
     
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          this.HeadersForSummary.push(data[i].heading) //Headers for table sumary
        }
        for (let i = 0; i < data.length; i++) {
          if (data[i].parameter != null) {
            data[i].parameter.calculation = data[i].calculation;
            this.paramListForSummary.push(data[i].parameter)     //param arrya to send to apicall
            this.keysForSummary.push(data[i].parameter.column_name)  //for matching key with api data
          }
        }
        this.getReportForSummary(this.HeadersForSummary, this.paramListForSummary);
      }
    }, err => this.handleError(err));

  }
  private getReportForSummary(HeadersForSummary, paramListForSummary) {
    if (this.displayedColumns.length != 0) {
      while (this.displayedColumns.length > 0) {
        this.displayedColumns.pop();
      }
    } //empty
    if (this.columnsToDisplay.length != 0) {
      while (this.columnsToDisplay.length > 0) {
        this.columnsToDisplay.pop();
      }
    } //empty
    this.rs.getDynamicReportForSummary(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval,
      this.paramListForSummary, this.oeeType, this.shift).subscribe(data => {

        if (data != null) {
          for (let i = 0; i < HeadersForSummary.length; i++) {
            data[i].headers = HeadersForSummary[i];
          }
          for (let key in data[0]) {
            this.displayedColumns.push(key);
            this.columnsToDisplay.push(key);
          }
          this.setTableDataForSummary(data);
        }
      }, err => this.handleError(err));
  }
  setTableDataForSummary(data) {
    if (data != null) {
      this.dataSource2 = new MatTableDataSource<any>(data);
      this.pdfDataForSummary = data;
      this.pdfReady = true;
      this.loadSummary = false;
    } else {
      this.loadSummary = true;
    }
  }


  //******************************************Monitoring Table*********************************
  private headersValueForMonitoring(id, type) {
    this.rs.getHeadersForMonitoring(id, type).subscribe(data => {
      if (this.paramListForMonitoring.length != 0) {
        while (this.paramListForMonitoring.length > 0) {
          this.paramListForMonitoring.pop();
        }
      } //Headers empty
      if (this.HeadersForMonitoring.length != 0) {
        while (this.HeadersForMonitoring.length > 0) {
          this.HeadersForMonitoring.pop();
        }
      } //empty
      if (this.keyForMonitoring.length != 0) {
        while (this.keyForMonitoring.length > 0) {
          this.keyForMonitoring.pop();
        }
      } //empty
      if (this.pdfData !== undefined) {
        while (this.pdfData.length > 0) {
          this.pdfData.pop();
        }
      } //empty
      this.HeadersForMonitoring = [];
      this.HeadersForMonitoring.push('Start Date-Time');
      this.HeadersForMonitoring.push('End Date-Time');
      if (data != null) {
        for (let i = 2; i < data.length; i++) {
          this.HeadersForMonitoring.push(data[i].heading) //Headers for table
        }
        for (let i = 0; i < data.length; i++) {
          if (data[i].parameter != null) {
            data[i].parameter.calculation = data[i].calculation;
            this.paramListForMonitoring.push(data[i].parameter)     //param arrya to send to api
            this.keyForMonitoring.push(data[i].parameter.column_name)  //for matching key with api data
          }
        }
        this.getReportForMonitoring(this.paramListForMonitoring, this.keyForMonitoring);
      }
    }, err => this.handleError(err));

  }
  private getReportForMonitoring(paramListForMonitoring, keyForMonitoring) {
    this.rs.getDynamicReportForMonitoring(
      this.plant,
      this.department,
      this.assembly,
      this.machineId,
      this.from,
      this.to,
      this.interval,
      this.paramListForMonitoring,
      this.oeeType, this.shift,
      0, 0
    ).subscribe(data => {
      this.setTableDataForMonitoring(data);
    }, err => this.handleError(err));
  }

  setTableDataForMonitoring(data) {
    if (data != null) {
      this.dataSource1 = new MatTableDataSource<any>(data);
      this.dataSource1.paginator = this.paginator;
      let tempData = this.rs.prioritizeColumns(data);
      this.pdfData = tempData;
      this.pdfReady = true;
      this.loadMonitoring = false;
    } else {
      this.loadMonitoring = true;
    }
  }
  //******************************************Highlight*********************************
  getHighlight() {
    this.highlight = '';
    this.rs.getHighLightForTable(this.reportId, this.plant, this.department, this.assembly, this.machineId,
      this.from, this.to, this.interval, this.paramListForSummary, this.oeeType, this.shift).subscribe(data => {
       
        if (data) {
          this.highlight = data;
          this.loadHighlight = false;
          this.pdfReady = true;
        } else {
          this.loadHighlight = true;
        }
      }, err => this.handleError(err));
  }

  //******************************************Charts*********************************
  private ChartDetails(reportId, machineId) {

    if (this.piechartReportData.length != 0) {
      while (this.piechartReportData.length > 0) {
        this.piechartReportData.pop();
      }
    } //empty
    if (this.doughnutchartReportData.length != 0) {
      while (this.doughnutchartReportData.length > 0) {
        this.doughnutchartReportData.pop();
      }
    } //empty

    if (this.guagechartReportData.length != 0) {
      while (this.guagechartReportData.length > 0) {
        this.guagechartReportData.pop();
      }
    } //empty

    if (this.chartReportData.length != 0) {
      while (this.chartReportData.length > 0) {
        this.chartReportData.pop();
      }
    } //empty

    if (this.Charts.pie.length != 0) {
      while (this.Charts.pie.length > 0) {
        this.Charts.pie.pop();
      }
    } //empty

    if (this.Charts.lineBar.length != 0) {
      while (this.Charts.lineBar.length > 0) {
        this.Charts.lineBar.pop();
      }
    } //empty

    if (this.Charts.guage.length != 0) {
      while (this.Charts.guage.length > 0) {
        this.Charts.guage.pop();
      }
    } //empty



    this.rs.getChartDetails(reportId, machineId).subscribe(data => {
      console.log("struct:::::",data);
      if (data !== null) {
        this.chartAtributes = data;
        this.chartAtributes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        for (let chart of this.chartAtributes) {
          this.parameterList = [];
          if (chart.chartData !== null) {
            if (chart.chartData.X.length != 0) {
              for (let chartdata of chart.chartData.X) {
                this.parameterList.push(chartdata.parameter);
              }
            }
            if (chart.chartData.Y.length != 0) {
              for (let chartdata of chart.chartData.Y) {
                this.parameterList.push(chartdata.parameter);
              }
            }
            this.setChart(this.parameterList, chart, chart.chartId, chart.chartType);
            this.showChart = false;
            this.pdfReady = true;
          }
        }
      }
    }, err => this.handleError(err));
  }

  setChart(paramList, chartAtributes, chartId, chartType) {
    this.rs.getChartData(chartId, this.plant, this.department, this.assembly, this.machineId,
      this.from, this.to, this.interval, paramList, this.oeeType, this.shift, 0, 0).subscribe(data => {
         console.log("Data",data);
        switch (chartType) {
          case 'line':
          case 'bar':
            this.callLineBarChart(chartAtributes, data);
            break;
          case 'pie':
          case 'doughnut':
            this.callPieDoughnutChart(chartAtributes, data);
            break;
          case 'guage':
            this.callGuageChart(chartAtributes, data);
            break;

        }
      });
  }


  callLineBarChart(chartAtributes, data) {
   
    if ((chartAtributes != null) && (data != null)) {
      let object = Object();
      object.chartDataType = chartAtributes.chartDataType;
      object.chartName = chartAtributes.chartName;
      object.chartType = chartAtributes.chartType;
      if (chartAtributes.chartData.X[0].chartColor != undefined) {
        object.chartLabelColor = chartAtributes.chartData.X[0].chartColor;
      }
      object.chartColor = [];
      object.chartLabel = [];
      object.chartData = [];
      object.sequence = chartAtributes.sequenceNumber;
      object.property = chartAtributes.property;

      let LabelColor = [];
      if (chartAtributes.chartDataType == 'summary') {
        for (let labels of chartAtributes.chartData.X) {
          LabelColor.push(labels.chartColor);
        }
      } else {
        for (let labels of chartAtributes.chartData.Y) {
          LabelColor.push(labels.chartColor);
        }
      }
      for (let colors of LabelColor) {
        let color = Object();
        if (chartAtributes.chartType === 'line') {
          color.backgroundColor = "transparent";
          color.borderColor = colors;
        } else {
          color.backgroundColor = colors;
          color.borderColor = colors;
        }
        object.chartColor.push(color);
      }// for colors*  

      let LabelArray = [];
      let DataSetArray = [];
      if (chartAtributes.chartDataType == 'summary') {
        if (chartAtributes.chartType == 'line') {
          let lineChartData = [];
          for (let key of chartAtributes.chartData.X) {
            for (let labels of data) {
              if (labels.headers == key.columnName) {
                lineChartData.push(labels.value);
                LabelArray.push(key.labelName);
                break;
              }
            }
          }// label for line chart....
          let datasetObject = Object();
          datasetObject.data = lineChartData.map(e => e);
          datasetObject.label = 'calculation';
          DataSetArray.push(datasetObject);
        } else {
          for (let key of chartAtributes.chartData.X) {
            let datasetObject = Object();
            datasetObject.data = [];
            for (let labels of data) {
              if (labels.headers == key.columnName) {
                datasetObject.data.push(labels.value);
                datasetObject.label = key.labelName;
                LabelArray.push(key.labelName);
                break;
              }
            }
            DataSetArray.push(datasetObject);
          }
        }
      } // this for Summary chart

      else {

        for (let labels of data) {
          LabelArray.push(labels.EndTime);
        }

        object.chartLabel = LabelArray.map(e => e); // for labels
        for (let key of chartAtributes.chartData.Y) {
          let datasetObject = Object();
          datasetObject.data = [];
          datasetObject.label = key.labelName;
          for (let labels of data) {
            for (let properties in labels) {
              if (key.columnName === properties) {
                let colName = properties;
                datasetObject.data.push(labels[colName]);
              }
            }
          }
          DataSetArray.push(datasetObject);
        }
      }

      object.chartData = DataSetArray.map(e => e);
      object.chartLabel = LabelArray.map(e => e); // for labels


      this.chartReportData.push(object);
      this.chartReportData.sort((a, b) => a.sequence - b.sequence);
      this.Charts.lineBar = [...this.chartReportData];

    }
  }

  callPieDoughnutChart(chartAtributes, data) {
  
    if ((chartAtributes != null) && (data != null)) {
      let object = Object();
      object.property = chartAtributes.property;
      object.chartDataType = chartAtributes.chartDataType;
      object.chartName = chartAtributes.chartName;
      object.chartType = chartAtributes.chartType;
      object.chartLabelColor = "";
      object.chartColor = [];
      object.chartLabel = [];
      object.chartData = [];
      object.sequence = chartAtributes.sequenceNumber;
      let colors = [];

      if (chartAtributes.chartData.Y.length != 0) {
        for (let search of chartAtributes.chartData.Y) {
        for (let key of data) {
            if (key.headers === search.columnName) {
              colors.push(search.chartColor);
              object.chartLabel.push(search.labelName);
              object.chartData.push(parseInt(key.value, 10));
              break;
            }
          }
        }
      }
      object.chartColor.push({ backgroundColor: colors });

      if (chartAtributes.chartType === 'pie') {
        this.piechartReportData.push(object);
        this.piechartReportData.sort((a, b) => a.sequence - b.sequence);
        this.Charts.pie = [...this.piechartReportData];
      }
      if (chartAtributes.chartType === 'doughnut') {
        this.doughnutchartReportData.push(object);
        this.doughnutchartReportData.sort((a, b) => a.sequence - b.sequence);
        this.Charts.doughnut = [...this.doughnutchartReportData];
      }  
    }
  }

  callGuageChart(chartAtributes, data) {
    if ((chartAtributes != null) && (data != null)) {

      let object = Object();
      object.property = chartAtributes.property;
      object.chartDataType = chartAtributes.chartDataType;
      object.chartName = chartAtributes.chartName;
      object.chartType = chartAtributes.chartType;
      object.chartLabelColor = "";
      object.chartColor = [];
      object.chartLabel = [];
      object.value;
      object.sequence = chartAtributes.sequenceNumber;
      let colors = [];

      if (chartAtributes.chartData.Y.length != 0) {
        for (let key of data) {
          for (let search of chartAtributes.chartData.Y) {
            if (key.headers === search.columnName) {
              colors.push(search.chartColor);
              object.chartLabel.push(search.labelName);
              object.value = key.value;
            }
          }
        }
      }
      this.guagechartReportData.push(object);
      this.guagechartReportData.sort((a, b) => a.sequence - b.sequence);
      this.Charts.guage = [...this.guagechartReportData];
    }
  }

  
setChartDetails(index, chartType, attribute){

  switch(chartType) {
    case 'lineBar'  :   return this.setChartDetailsForLineBar(index, chartType, attribute);
    case 'guage'    :   return this.setChartDetailsForGuage(index, chartType, attribute);
    case 'pie'      :    
    case 'doughnut' :                 
                        return this.setChartDetailsForPieDougnut(index, chartType, attribute); 
           
  }
}

setChartDetailsForPieDougnut(index, chartType, attribute) {
  for (let key in this.Charts) {
    if (key === chartType) {
      let ArrayForChart = this.Charts[key];
      switch (attribute) {
        case 'datasets': return ArrayForChart[index].chartData;
        case 'labels': return ArrayForChart[index].chartLabel;
        case 'chartType': return ArrayForChart[index].chartType;
        case 'colors': return ArrayForChart[index].chartColor;
        case 'legend': 
          let acutalProperty = JSON.parse(ArrayForChart[index].property);
           return (acutalProperty.legend =="true");
        case 'options':
        let acutalOptionProperty=JSON.parse(ArrayForChart[index].property);
        if(acutalOptionProperty.option){
          return acutalOptionProperty.option;
        }else{
          return this.PieChartOptions;
        }

      }
    }
  }
}


setChartDetailsForLineBar(index, chartType, attribute) {
  for (let key in this.Charts) {
    if (key === chartType) {
      let ArrayForChart = this.Charts[key];
      switch (attribute) {
        case 'datasets': return ArrayForChart[index].chartData;
        case 'labels': return ArrayForChart[index].chartLabel;
        case 'chartType': return ArrayForChart[index].chartType;
        case 'colors': return ArrayForChart[index].chartColor;
        case 'legend': if ((ArrayForChart[index].chartDataType === 'summary') && (ArrayForChart[index].chartType === 'line')) {
          return false;
        } else {
          if(ArrayForChart[index].property!==undefined){
          let acutalProperty = JSON.parse(ArrayForChart[index].property);
          return (acutalProperty.legend =="true");
          }else{
            return true;
          }
        }
        case 'options':
         
          let acutalOptionProperty;
          if(ArrayForChart[index].property!==undefined){
            acutalOptionProperty=JSON.parse(ArrayForChart[index].property);
          }
          if(acutalOptionProperty!==undefined){
            return acutalOptionProperty.option;
          }else{
            return this.ChartOptions;
          }

          // if ((ArrayForChart[index].chartDataType === 'summary') && (ArrayForChart[index].chartType === 'bar')) {
          //   return this.ChartOptionsForSummary;
          // } else {
          //   return this.ChartOptions;
          // }

      }
    }
  }
}


setChartDetailsForGuage(index, chartType, attribute) {
    if (this.Charts[chartType] !== 0) {
      let guages = [...this.Charts[chartType]];
      let acutalProperty = JSON.parse(guages[index].property);
      let compareProperty = {
        type: "semi",
        label: "Speed",
        append: "km/hr",
        min: 0,
        max: 100,
        cap: 'round',
        thick: 15,
        size: 200
      }
      let object = Object.assign(compareProperty, acutalProperty);
      switch (attribute) {
        case 'size': return object.size;

        case 'type': return object.type;

        case 'append': return object.append;

        case 'min': return object.min;

        case 'max': return object.max;

        case 'cap': return object.cap;

        case 'thick': return object.thick;

      }
    }
  }

  private handleError(err, id = 0) {
    this.loadMonitoring = true;
    this.loadSummary = true;
    this.loadHighlight = true;
    this.showChart = true;
    this.Errormsg = false;
    this.errMessage = this.error.getErrorMessage(id);
    this.rs.throwError(err);
  }


}