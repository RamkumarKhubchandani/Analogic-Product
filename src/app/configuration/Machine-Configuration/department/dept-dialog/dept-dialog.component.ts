import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';

import { ConfigurationService } from '../../../configuration.service';
import { MODE } from '../../../shared/config';

@Component({
  selector: 'app-dept-dialog',
  templateUrl: './dept-dialog.component.html',
  styleUrls: ['./dept-dialog.component.scss']
})
export class DeptDialogComponent implements OnInit {
  department: FormGroup;
  loading: boolean;
  plants;
  constructor(
    private _dialogRef: MatDialogRef<DeptDialogComponent>,
    private _fb: FormBuilder,
    private _depart: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any
  ) {
    this.department = this._fb.group({
      id: '',
      plantId: ['', Validators.required],
      deptName: ['', [Validators.required,Validators.pattern("^.*\\S.*[A-Za-z]+$")]]
    });
    if (dialog.mode === MODE.UPDATE){ 
      this._depart.getPlants(0,0).subscribe(data => {
        this.plants = data;
      });
      this.department.setValue(dialog.details)
    };
  }
  
  ngOnInit() {
    this._depart.getPlants(0,0).subscribe(data => {
      this.plants = data;
    });
  }


  onSubmit() {
    if (this.department.valid) {
      this.update(this.department.value, this.dialog.mode);
    }
  }

  update(department, mode) {
    let temp = Object.assign({}, department);
    this.department.disable();
    this.loading = true;
    
    switch (mode) {
      case MODE.ADD: 
      delete temp.id;
        this._depart
          .addDept(temp)
          .subscribe(
            newAlarm => this._dialogRef.close(newAlarm),
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:  
      this._depart.updateDepart(department.id,department.deptName,department.plantId)
          .subscribe(
            res => this._dialogRef.close(res),
            err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._depart
          .deleteDept(department.id)
          .subscribe(
            res => this._dialogRef.close(department),
            err => this.handleError(err)
          );
        break;

      default:
        return;
    }
  }

  private handleError(err) {
    this._depart.throwError(err);
    this.department.enable();
    this.loading = false;
  }
}




