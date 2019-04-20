import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from "../material/material.module";

import {ReportFormComponent} from "../reports/report-form/report-form.component"

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";

import { ReportsService } from "../reports/reports.service";

import {ConfigurationService} from '../configuration/configuration.service';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [ReportFormComponent],
  exports: [
    ReportFormComponent
  ],
  providers: [ReportsService,ConfigurationService]
})
export class SharedComponentModule { }
