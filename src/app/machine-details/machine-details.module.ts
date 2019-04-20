import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from "../core/core.module";
import {MachineDetailsRoutingModule} from "./machine-details.routing.module"
import { SharedModule } from "../shared/modules/shared.module";
import {MachineDetailsComponent} from "./machine-details.component";
// import { MachineCategoryComponent } from './machine-category/machine-category.component';
// import {MachineCategoryModule} from './machine-category/machine-category.module'
import { PipesModule } from "../shared/pipes/pipe.module";
import {MachineService} from "../machine/machine.service";


import {DefaultMachineDbComponent} from "./common/default-machine-db/default-machine-db.component"




import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {ReportFormComponent} from "../reports/report-form/report-form.component"
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";

import { ReportsService } from "../reports/reports.service";

import {ConfigurationService} from '../configuration/configuration.service';

@NgModule({
  imports: [
    CommonModule, 
    CoreModule,
    MachineDetailsRoutingModule,
    SharedModule,
    PipesModule,
    // FormsModule,
    // ReactiveFormsModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule
     
    
  ],
  declarations: [MachineDetailsComponent,DefaultMachineDbComponent],
  providers: [MachineService]
  // exports: [
  //   MachineCategoryComponent
  // ]
})
export class MachineDetailsModule { }
