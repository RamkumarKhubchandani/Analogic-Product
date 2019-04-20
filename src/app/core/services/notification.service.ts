import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  notify(message: string, action: string = "", duration = 2000) {
    console.log("msg",message);
    this._snackBar.open(message, action, {
      duration
    });
  }
}
