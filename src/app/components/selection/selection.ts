import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  OnDestroy,
  Output
} from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { MaterialModule } from "../../material/material.module";
import { SelectionService } from "./selection.service";
import {MachineService} from '../../machine/machine.service';


@Component({
  selector: "selection",
  templateUrl: "./selection.component.html",
  styleUrls: ["./selection.component.scss"],
  providers: [SelectionService]
})
export class SelectionComponent implements OnInit {

  @Output() select = new EventEmitter();
  @Output() specialMachine = new EventEmitter<boolean>();
  @Input() dashboardtype:string;
  @Input() isPageType: String;
  errorMsg:string;
  insight: Insight = new Insight();
  plantOptions = [];
  deptOptions = [];
  assemblyOptions=[];
  machineOptions=[];
  pageType = [];
  dbType = "";
  
  constructor( 
    private error: GlobalErrorHandler,
    private router: Router,private selection: SelectionService, 
    private machineS: MachineService,
    private snack:MatSnackBar) {
    }

  ngOnInit() {
    
    if(this.isPageType){
        this.dbType = "";
        this.selection.getPageType("abc").subscribe(data => {
           console.log(data);
           this.pageType.length = 0;
           data && data[0] && data.map(row => {
              this.pageType.push(row)
           })
           this.insight.pagetype=data[0].page_type;
           this.dbType = data[0].page_type;
           this.selection.getdafaultfilter(this.insight.pagetype).subscribe(
            data => {  
              if (data) { 
                this.insight.plant=data['plantId'];
                this.insight.department=data['deptId'];
                this.insight.assembly=data['assemblyId'];
                this.insight.machine=data['id'];
                this.onDefaultValue(this.insight.plant,this.insight.department, this.insight.assembly, this.insight.machine)
              }
            
            },
            err => this.handleError(err)
          );
           
        },
        err => this.handleError(err)
        )
    }else{    
        this.dbType = this.dashboardtype;
        this.selection.getdafaultfilter(this.dbType).subscribe(
          data => {  
            if (data) { 
              this.insight.plant=data['plantId'];
              this.insight.department=data['deptId'];
              this.insight.assembly=data['assemblyId'];
              this.insight.machine=data['id'];
              this.onDefaultValue(this.insight.plant,this.insight.department, this.insight.assembly, this.insight.machine)
            }
          
          },
          err => this.handleError(err)
        );
      
    } 
    
  }
  onChangePageType(value){
    this.dbType = value;
    this.selection.getdafaultfilter(this.dbType).subscribe(
      data => {  
        if (data) { 
          this.insight.plant=data['plantId'];
          this.insight.department=data['deptId'];
          this.insight.assembly=data['assemblyId'];
          this.insight.machine=data['id'];
          this.onDefaultValue(this.insight.plant,this.insight.department, this.insight.assembly, this.insight.machine)
        }
      
      },
      err => this.handleError(err)
    );
  }
  onDefaultValue(plant,department,assembly,machine){
   this.selection.getPlant().subscribe(data => {
      if(data != null)
      { 
        this.plantOptions = data;
        this.insight.plant=plant;
      }
      else {
        this.plantOptions=null;
        this.snack.open('No plants', 'ok', {
          duration: 5000
        });
      }},err => this.handleError(err));
     
     
      this.selection.getDept(plant).subscribe((data: any[])  => {
        if(data != null){  
          this.deptOptions = data;
          this.insight.department=department;  
        }
        else {
          this.deptOptions=null;
          this.assemblyOptions=null;
          this.machineOptions=null;
          this.snack.open('This Plant does not have Departments', 'ok', {
            duration: 5000
          });
        }},err => this.handleError(err));


        this.selection.getAssembly(department).subscribe((data: any[])  => {
          if(data != null){
            this.assemblyOptions = data;
            this.insight.assembly=assembly;
          }
          else {
            this.assemblyOptions=null;
            this.machineOptions=null;
            this.snack.open('This Department does not have Assemblyes', 'ok', {
              duration: 5000
            });
          }},err => this.handleError(err));
  
          this.selection.getMachineNames(plant, department, assembly,this.dbType)
          .subscribe(data => {
            if(data!= null){
              this.machineOptions = data;
              this.insight.machine=machine;
              this.getInsights(machine,this.dbType);
            }
            else {
              this.machineOptions=null;
              this.snack.open('This Assembly does not have Machines', 'ok', {
                duration: 5000
              });
            }},err => this.handleError(err));
    
    }  


    
/************************end of process *******************/
  onChange(event:number) {
    this.insight.department=-0;
    this.insight.assembly=-0;
    this.insight.machine=-0;
    this.insight.plant=event;
    this.selection.getDept(event).subscribe((data: any[])  => {
      if(data != null){  
        this.deptOptions = data;
      }
      else {
              this.deptOptions=null;
              this.assemblyOptions=null;
              this.machineOptions=null;
        this.snack.open('This Plant does not have Departments', 'ok', {
          duration: 5000
        });
      }},err => this.handleError(err));
  }

  onChangeDepartment(event:number) {
    this.insight.assembly=-0;
    this.insight.machine=-0;
    this.insight.department=event;
    this.selection.getAssembly(event).subscribe((data: any[])  => {
      if(data != null){
        this.assemblyOptions = data;
      }
      else {
        this.assemblyOptions=null;
        this.machineOptions=null;
        this.snack.open('This Department does not have Assemblyes', 'ok', {
          duration: 5000
        });
      }},err => this.handleError(err));
    }

  onChangeAssembly(event:number) {
    this.insight.machine=-0;
    this.insight.assembly=event;
    this.selection.getMachineNames(this.insight.plant,this.insight.department,this.insight.assembly,this.dbType)
          .subscribe(data => {
            if(data!= null){
              this.machineOptions = data;
            }
            else {
              this.machineOptions=null;
              this.snack.open('This Assembly does not have Machines', 'ok', {
                duration: 5000
              });
            }},err => this.handleError(err));
  }

  onSelectMachine(event:number) {
    this.getInsights(event,"");
  }

  getInsights(machineID:number,dbType : string){
      this.select.emit({machineID,dbType});
  }
  
  private handleError(err) {
    this.error.handleError(err);
  }

}
class Insight {
  plant:number;
  department:number;
  assembly:number;
  machine:number;
  pagetype:string;
}

@NgModule({
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule],
  declarations: [SelectionComponent],
  exports: [SelectionComponent]
})
export class SelectionModule {}

