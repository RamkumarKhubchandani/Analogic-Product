import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import {
  ADD_UPDATE_DIALOG_OPTIONS,
  DELETE_DIALOG_OPTIONS,
  DIALOG_OPTIONS,
  DIALOG_BUTTONS,
  DIALOG_HEADER,
  MODE
} from '../shared/config';
import { ConfigurationService } from '../configuration.service';
import { AssociatedMachineDialogComponent } from './associated-machine-dialog/associated-machine-dialog.component';


@Component({
  selector: 'app-associated-machine',
  templateUrl: './associated-machine.component.html',
  styleUrls: ['../configstyle.scss']
})
export class AssociatedMachineComponent {
  actionMode: string;
  dataSource = new MatTableDataSource<any>();

  dialogRef;
  displayedColumns = [
    'associated_name',
    'assign_flag',
    'actions'
  ];
  errMessage: string;
  loaded: boolean;
  subscriber: Subscription;
  hiddenData: boolean;
  errhidden: boolean;


  currentPage = 0;
  pageSize = 10;
  array: any;

  datasetLength: number;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private _intl: MatPaginatorIntl, public dialog: MatDialog, private config: ConfigurationService) {
    this.getDefaultSet(0,0);
  }

  getDefaultSet(limit,offset){
     this.subscriber = this.config.getAssociatedMachineDetails(limit,offset).subscribe(
      data => { 
        if(data == null)
        {
          this.handleErrorOFNoMoreData();
          this.hiddenData = true;
       }
        else
        {
          this.setTableData(data);
          this.loaded = true;
          this.hiddenData = false;
          this.errhidden = true;
       }
      },
      err => this.handleError(err)
    );
  
  }
  

  ngAfterViewInit() {
    this._intl.itemsPerPageLabel = "Record per Page";

  }




  addmachine(mode = 'add') {
    this._dialog(ADD_UPDATE_DIALOG_OPTIONS, mode, {});
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  update(row, mode) {
    this._dialog(
      mode === MODE.UPDATE ? ADD_UPDATE_DIALOG_OPTIONS : DELETE_DIALOG_OPTIONS,
      mode,
      Object.assign({}, row)
    );
  }

  private _dialog(options: DIALOG_OPTIONS, mode: string, data) {
    this.actionMode = mode;
    this.dialogRef = this.dialog.open(AssociatedMachineDialogComponent, {
      ...options,
      data: {
        mode: mode,
        details: data,
        btnCaptions: DIALOG_BUTTONS(mode),
        title: DIALOG_HEADER(mode)
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe((data: any) => {
      if (typeof data != 'string') {
        this.subscriber = this.config.getAssociatedMachineDetails(0,0).subscribe(
          data => {
            if (data == null) {
              this.paginator.pageIndex = 0;
              this.getDefaultSet(0,0);
            }
            else {
               this.setTableData(data); 
              this.loaded = true;
              this.hiddenData = false;
              this.errhidden = true;
            }
          },
          err => this.handleError(err)
        );
      }
    });
  }

  updateDataset(e: any) {
  
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
  }

  private setTableData(data) {
    if (data && data.length > 0) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.array = data;
      this.datasetLength = this.array.length;
      this.iterator();
    } else {
      this.errMessage = this.config.getErrorMessage(1);
    }
    this.reset();
  }


  private handleError(err) {
    this.reset();
    this.errMessage = this.config.getErrorMessage(1);
    this.config.throwError(err);
  }

  private handleErrorOFNoMoreData() {
    this.reset();
    this.hiddenData = true;
    this.errhidden = false;
    this.errMessage = this.config.getErrorMessage(1);

  }

  private reset() {
    this.loaded = true;
  }
}

