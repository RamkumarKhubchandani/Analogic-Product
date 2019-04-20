import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder,Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {MatSnackBar} from '@angular/material/snack-bar';
import { MODE } from "./../../../shared/config";
import { ConfigurationService } from "./../../../../configuration/configuration.service";
import { switchMap } from "rxjs/operators";

@Component({
  selector: 'app-assembly-dialog',
  templateUrl: './assembly-dialog.component.html',
  styleUrls: ['./assembly-dialog.component.scss']
})
export class AssemblyDialogComponent implements OnInit {
  assembly: FormGroup;
  plants: any[];
  depts:any[];
  loading: boolean = true;
  disabled: boolean;
  title: string = "assembly";

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog: any,
    private _formBuilder: FormBuilder,
    private snack:MatSnackBar,
    private cs: ConfigurationService,
    private _dialogRef: MatDialogRef<AssemblyDialogComponent>
    ) {
    this.assembly = this._formBuilder.group({
      id: "",
      plantId: ["",Validators.required],
      deptId: ["",Validators.required],
      assemblyName: [" ", [Validators.required,Validators.pattern("^.*\\S.*[A-Za-z]+$")]]
    });
    this.assembly.disable();

    if (dialog.mode === MODE.ADD) {
      this.cs.getPlants(0,0).subscribe(data=>{
        this.plants=data;
        this.loading = false;
        this.assembly.enable();
      }, err => this.handleError(err));

    }
    if (dialog.mode === MODE.DELETE) {
      this.loading = false;
      this.assembly.enable();
    }
  

    if (dialog.mode === MODE.UPDATE) {
   
      this.assembly.setValue(dialog.details);
      this.cs.getPlants(0,0).pipe(switchMap(plants => {
        this.plants = plants;
         this.assembly.controls["plantId"].setValue(Number(this.assembly.value.plantId));
        return this.cs.getDept(this.assembly.value.plantId);
      })
     ).subscribe(depts => {
      this.depts = depts;
      this.assembly.controls["deptId"].setValue(Number(this.assembly.value.deptId));
      this.loading = false;
      this.assembly.enable();
    });
  
    }

  }

  onAssemblySubmit() { 
    if (this.assembly.valid) {
    this.update(this.assembly.value,this.dialog.mode);
    }
  }


  update(parameter,mode) {
    this.assembly.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
        this.cs
          .addAssembly(parameter)
          .subscribe(
            newAssembly =>
              this.cs
                .getAssemblyWithID(newAssembly)
                .subscribe(
                  resp => this._dialogRef.close(resp),
                  err => this.handleError(err)
                ),
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:
        this.cs.updateAssembly(parameter).subscribe(
          ({ assemblyName, id, ...rest }: any) =>
            this._dialogRef.close({
              assemblyName,
              deptName: rest.department.deptName,
              plantName: rest.plants.plantName,
              deptId: rest.department.id,
              id,
              plantId: rest.plants.id
            }),
          err => this.handleError(err)
        );
        break;

     case MODE.DELETE:
        this.cs
          .deleteassemblys(parameter.id)
          .subscribe(
            res => this._dialogRef.close(parameter),
            err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this.cs.throwError(err);
    this.assembly.enable();
    this.loading = false;
  }
  ngOnInit() {}

  onPlantChange(e)
  {
    this.assembly.get('deptId').setValue('');
    this.cs.getDept(e).subscribe(
      data => {
        if(data!=null)
               this.depts=data;
        else
        this.snack.open('This Plant does not have Departments', 'ok', {
          duration: 5000
        });
     }
    )
  }
  
}
