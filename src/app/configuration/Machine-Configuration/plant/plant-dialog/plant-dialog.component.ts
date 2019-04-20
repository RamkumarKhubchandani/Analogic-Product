import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ConfigurationService } from '../../../configuration.service';
import { MODE } from '../../../shared/config';

@Component({
  selector: 'app-plant-dialog',
  templateUrl: './plant-dialog.component.html',
  styleUrls: ['./plant-dialog.component.scss']
})
export class PlantDialogComponent {
  plant: FormGroup;
  loading: boolean;

  constructor(
    private _dialogRef: MatDialogRef<PlantDialogComponent>,
    private _fb: FormBuilder,
    private cs: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any
  ) {
    this.plant = this._fb.group({
      id: '',
      plantName: ['', [Validators.required,Validators.pattern("^.*\\S.*[A-Za-z]+$")]]
    });
    if (dialog.mode === MODE.UPDATE){ this.plant.setValue(dialog.details)};
  }

  onSubmit() {
    if (this.plant.valid) {
      this.update(this.plant.value, this.dialog.mode);
    }
  }

  update(plant, mode) {
    this.plant.disable();
    this.loading = true;
    switch (mode) {
      case MODE.ADD:
      this.cs
        .addPlants(plant)
        .subscribe(
          newParameter => this._dialogRef.close(newParameter),
          err => this.handleError(err)
        );
      break;

      case MODE.UPDATE:
      this.cs
        .updatePlant(plant)
        .subscribe(
          res => this._dialogRef.close(res),
          err => this.handleError(err)
        );
      break;

    case MODE.DELETE:
      this.cs
        .deletePlant(plant.id)
        .subscribe(
          res => this._dialogRef.close(plant),
          err => this.handleError(err)
        );
      break;

      default:
        return;
    }
  }

  private handleError(err) {
    this.cs.throwError(err);
    this.plant.enable();
    this.loading = false;
  }
}
