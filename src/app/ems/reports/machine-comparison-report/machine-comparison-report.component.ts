import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import {omit} from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatButton } from '@angular/material';
import * as moment from 'moment';
import { MachineComparisonReportService } from './machine-comparison-report.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NewPdfComponent} from '../../../new-pdf/new-pdf.component';
@Component({
  selector: 'app-machine-comparison-report',
  templateUrl: './machine-comparison-report.component.html',
  styleUrls: ['./machine-comparison-report.component.scss']
})

export class MachineComparisonReportComponent implements OnInit {
  public options1 = {  year: 'numeric', month: 'long', day: 'numeric' };

  pdfData = {
    REPORT_TYPE: 'machineComparisonReport',
    // DASHBOARD_BOX_DETAILS: this.DASHBOARD_BOX_DETAILS.MCC_DASHBOARD,
    reportFileName : 'MachineComparison_Report',
    reportPaperSize : 'A4',
    reportLandscap : false
  };

  pdfTableRowData;
 // btnRef: ElementRef;
  FirstPlantAndMachine ;
  SecondPlantAndMachine;
  ThirdPlantAndMachine;
  FourthPlantAndMachine;
  spinerLoaded:boolean=false;
  Errormsg:boolean=false;
  loaded:boolean=true;
  errMessage: string;
  listOfPlantAndMachine=[];
  machineTypes: any;
  machineType;
  plants:any;
  plantId:number;
  MachineCompare:FormGroup;
  firstmachines;
  secondmachines;
  thirdmachines;
  fourthmachines;
 

  fromStartAt;
  toStartAt;
  max: Date = new Date();
  min: Date = new Date();

  reportVal: any;
  // pdfData: any[] = [];
  pdfReady: boolean;

  displayedColumns: any = [];
  columnsToDisplay: string[] = [];
  data: MatTableDataSource<any> = new MatTableDataSource<any>();
  invalid = true;

  textFormobile:string;
  @ViewChild('downloadPdfBtn') btnRef: MatButton;
  @ViewChild('pdfContainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(private fb: FormBuilder, private machineComparisonReportService: MachineComparisonReportService, private snack: MatSnackBar, private resolver: ComponentFactoryResolver) { 
  this.MachineCompare = this.fb.group({
    from: [this.machineComparisonReportService.getDate(),Validators.required],
    to: ['',Validators.required],
    machineType: ['', Validators.required],
    firstPlantId: ['', Validators.required],
    firstMachineId: ['',Validators.required],
    secondPlantId: ['',Validators.required],
    secondMachineId: ['',Validators.required],
    thirdPlantId: [''],
    thirdMachineId: [''],
    fourthPlantId: [''],
    fourthMachineId: [''],
  });
}
  ngOnInit() {
    this.machineComparisonReportService.getMachineType().subscribe( data => {
      if (data != null) {
        this.machineTypes = data;
      } else {
        this.snack.open('No machine types', 'ok', {
          duration: 5000
        });
      }
     }, err => this.handleError(err));

    // this.machineComparisonReportService.getPlant().subscribe( data =>
    //   {   if (data!=null) 
    //       { this.plants = data; }
    //       else 
    //       {
    //         this.snack.open('No plants', 'ok', {
    //           duration: 5000
    //         });
    //       }
    //  },err => this.handleError(err));
  }
  checkSelection(){
    if(this.MachineCompare.get('firstPlantId').valid && this.MachineCompare.get('firstMachineId').valid
      && this.MachineCompare.get('secondPlantId').valid && this.MachineCompare.get('secondMachineId').valid)
      this.invalid=false;
  }
 
onChangeMachineType(machineName){
  this.machineType = machineName;
  this.machineComparisonReportService.getPlant().subscribe( data =>
    {   if (data!=null) 
        { this.plants = data; }
        else 
        {
          this.snack.open('No plants', 'ok', {
            duration: 5000
          });
        }
   },err => this.handleError(err));
}
 onChangePlant(plantDetails, index) {
    this.checkSelection();
    let discardedMachines=[];
    this.plantId=plantDetails.id;
  
   if(this.listOfPlantAndMachine.length!=0){
       for(let i=0;i<this.listOfPlantAndMachine.length;i++){
        if(this.listOfPlantAndMachine[i].plant== this.plantId){
        discardedMachines.push(this.listOfPlantAndMachine[i].machine['id']);
        }
       }
    }

    this.machineComparisonReportService.getPlantWiseMachine(this.plantId, this.machineType, discardedMachines).subscribe(data => { 
      if(data!=null){
       if(index==1){this.firstmachines=data;}if(index==2){this.secondmachines=data;}
       if(index==3){this.thirdmachines=data;}if(index==4){this.fourthmachines=data;}
      }
      else{ 
          this.snack.open('No machine', 'ok', {
          duration: 5000
        });
      }
      },err => this.handleError(err));
  }
  
  onChangeMachine(machine,index){
    this.checkSelection();
    let newlist={
      index:index,
      plant:this.plantId,
      machine:machine
    },
    flag=0,
    value={},
    plant,
    ind;

// For Restore the item before change 
if(this.listOfPlantAndMachine.length!=0){
  for(let i=0;i<this.listOfPlantAndMachine.length;i++){
    if(this.listOfPlantAndMachine[i].index==index){
      value=this.listOfPlantAndMachine[i].machine;
      plant=this.listOfPlantAndMachine[i].plant;
      break;
    }
  }  
}
for(let i=0;i<this.listOfPlantAndMachine.length;i++){
  if(this.listOfPlantAndMachine[i].index!=index){
    if(this.listOfPlantAndMachine[i].plant==plant){
        ind=this.listOfPlantAndMachine[i].index;
        if(ind==1)this.firstmachines.push(value);
        if(ind==2)this.secondmachines.push(value);
        if(ind==3)this.thirdmachines.push(value);
        if(ind==4)this.fourthmachines.push(value);
    }
  }
}
////////end///////

  //Stored latest changes 
    if(this.listOfPlantAndMachine.length==0){
      this.listOfPlantAndMachine.push(newlist);
    }
    
      this.listOfPlantAndMachine.map((todo, i) => {      // For change if index is match
        if (todo.index == newlist.index){
           flag=1;
           this.listOfPlantAndMachine[i] = newlist;
         }
       });
       if(flag==0){
        this.listOfPlantAndMachine.push(newlist);       //if index not match
       }
     ///end/////// 
  
  
  
       this.updateList(machine['id'],index);  //For Update each list

  }
 updateList(id, index) { 
   switch(index){
     case 1:
     if(this.secondmachines!=undefined)this.secondmachines = this.secondmachines.filter(function(e) { return e.id !== id; });
     if(this.thirdmachines!=undefined)this.thirdmachines = this.thirdmachines.filter(function(e) { return e.id !== id; });
     if(this.fourthmachines!=undefined)this.fourthmachines = this.fourthmachines.filter(function(e) { return e.id !== id; });
     break;
     case 2:
     if(this.firstmachines!=undefined)this.firstmachines = this.firstmachines.filter(function(e) { return e.id !== id; });
     if(this.thirdmachines!=undefined)this.thirdmachines = this.thirdmachines.filter(function(e) { return e.id !== id; });
     if(this.fourthmachines!=undefined)this.fourthmachines = this.fourthmachines.filter(function(e) { return e.id !== id; });
     break;
     case 3:
     if(this.firstmachines!=undefined)this.firstmachines = this.firstmachines.filter(function(e) { return e.id !== id; });
     if(this.secondmachines!=undefined)this.secondmachines = this.secondmachines.filter(function(e) { return e.id !== id; });
     if(this.fourthmachines!=undefined)this.fourthmachines = this.fourthmachines.filter(function(e) { return e.id !== id; });
     break;
     case 4:
     if(this.firstmachines!=undefined)this.firstmachines = this.firstmachines.filter(function(e) { return e.id !== id; });
     if(this.thirdmachines!=undefined)this.thirdmachines = this.thirdmachines.filter(function(e) { return e.id !== id; });
     if(this.secondmachines!=undefined)this.secondmachines = this.secondmachines.filter(function(e) { return e.id !== id; });
     break;
   }

 }

setMinToDate() {
  const { from } = this.MachineCompare.value;
  this.min = from;
}


  onSubmit(){  
  
      this.spinerLoaded=true;
      this.loaded=true;
      this.Errormsg=true;
      this.pdfReady = false;
      this.getMachineCompareDate(this.MachineCompare.value);
    
    
  }

  getMachineCompareDate(MachineCompare) {
    this.FirstPlantAndMachine = `Plane :${MachineCompare.firstPlantId.plantName} Machine:${MachineCompare.firstMachineId.machineName}`;
    this.SecondPlantAndMachine =  `Plane :${MachineCompare.secondPlantId.plantName} Machine:${MachineCompare.secondMachineId.machineName}`;
    this.pdfData['fromDate'] = MachineCompare.from.toLocaleDateString('en-US', this.options1);
    this.pdfData['fromTime'] = MachineCompare.from.toLocaleTimeString('en-US');
    this.pdfData['toDate'] = MachineCompare.to.toLocaleDateString('en-US', this.options1);
    this.pdfData['toTime'] = MachineCompare.to.toLocaleTimeString('en-US');
    console.log(`selected machines >>${JSON.stringify(MachineCompare)}`);
   this.reportVal = { ...MachineCompare, type: "machineComparisonReport" };
   this.machineComparisonReportService.getMachineCompareData(MachineCompare).subscribe(
          data => this.setTableData(data),
          err => this.handleError(err));

  }

    setTableData(data) {
    this.pdfData['monitoringDataRow'] = data;
      let tempData = [];
      if(data!=null) {
        data.forEach(item => {
          tempData.push({
           // Parameter: item.Parameter,
            ...omit(item, ["Parameter"])
          });
        });
        this.data = new MatTableDataSource<any>(data);
        this.displayedColumns = [];
        this.columnsToDisplay = [];
      
        for (let key in tempData[0]) {
       //   this.displayedColumns.push(key);
          this.columnsToDisplay.push(key);
        }

        this.displayedColumns = [
          {
            headers : 'Parameter',
            value : '0'
          },
          {
            headers : this.FirstPlantAndMachine,
            value : '1'
          },
          {
            headers : this.SecondPlantAndMachine,
            value : '2'
          }
        ];
        this.pdfData['monitoringDataColumn'] = this.displayedColumns;
        console.log("this.columnsToDisplay",this.columnsToDisplay);
        this.textFormobile='1)'+this.displayedColumns[1]+'  2)'+this.displayedColumns[2];
       // this.pdfData = tempData;
        this.pdfReady = true;
        this.loaded=false;
        this.spinerLoaded=false;
        this.Errormsg=true;
      }
      else{
        this.loaded=true;
        this.spinerLoaded=false;
        this.Errormsg=false;
        this.errMessage = this.machineComparisonReportService.getErrorMessage(1);
      }
      this.btnRef._elementRef.nativeElement.disabled = false;
      this.btnRef._elementRef.nativeElement.addEventListener('click', this.createComponent.bind(this));
  }

  private getDateTime = date => moment(date).format("YYYY-MM-DD HH:mm:ss");

  private handleError(err, id = 0) {
    this.errMessage = this.machineComparisonReportService.getErrorMessage(id);
    this.machineComparisonReportService.throwError(err);
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
