import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { MODE } from '../../shared/config';
import { switchMap } from "rxjs/operators";
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class UserDialogComponent{
  user: FormGroup;
  loading: boolean;
  roleList;
  roleID:number;
  constructor(
    private _dialogRef: MatDialogRef<UserDialogComponent>,
    private _fb: FormBuilder,
    private _user: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public dialog: any) {
    this.user = this._fb.group({
      id: '',
      name: ['', [Validators.compose([Validators.required,Validators.pattern("^.*\\S.*[A-Za-z]+$")])]],
      uiRole: ['', Validators.required],
      username: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(8)]],
      email:['',[Validators.required,Validators.email]],
      mobile:['',[Validators.required,Validators.maxLength(10),Validators.minLength(10),Validators.pattern("^[0-9]+$")]]
    });

    this._user.getRole().subscribe(roles => {
      this.roleList = roles;
    });
    if (dialog.mode === MODE.UPDATE){ 
      
      this._user.getRole().subscribe(roles => {
        this.roleList = roles;
        this.roleID=dialog.details.uiRole[0].id;
      });
      this.user.setValue(dialog.details); 
    };
    
  }

  onSubmit() {
    if (this.user.valid) {
      this.update(this.user.value,this.dialog.mode);
    }
  }


update(user, mode) {
    
    let tempData = Object.assign({}, user);
    let valueofRole=[];
    valueofRole.push(tempData.uiRole);
    tempData.roles =valueofRole;
    delete tempData.uiRole;
    this.user.disable();

    this.loading = true;
    switch (mode) {
      case MODE.ADD:
    
        this._user
          .addUser(tempData)
          .subscribe(
            newAlarm => { this._dialogRef.close(newAlarm)},
            err => this.handleError(err)
          );
        break;

      case MODE.UPDATE:  
        this._user
          .updateUser(tempData)
          .subscribe(
            res => {this._dialogRef.close(res)},
            err => this.handleError(err)
          );
        break;

      case MODE.DELETE:
        this._user
          .deleteUser(user.id)
          .subscribe(
            res => {this._dialogRef.close(user)},
            err => this.handleError(err)
          );
        break;
      default:
      return;
    }
  }

  private handleError(err) {
    this._user.throwError(err);
    this.user.enable();
    this.loading = false;
  }
}

const Role_LIST = [
'ROLE_USER',
'ROLE_ADMIN',
'ROLE_PARTICIPANT'
];
