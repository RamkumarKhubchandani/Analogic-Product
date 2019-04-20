import { NgModule } from "@angular/core";

import { ChartsModule } from "ng2-charts";
import { SpinnerModule } from "../../components/spinner/";
import { MaterialModule } from "../../material/material.module";
import { SelectionModule } from "../../components/selection/index";
import { SummaryModule } from "../../components/summary/";
import { ErrorModule } from "../../components/error/";

const ShareModules = [
  ChartsModule,
  ErrorModule,
  MaterialModule,
  SelectionModule,
  SpinnerModule,
  SummaryModule
];

@NgModule({
  imports: [...ShareModules],
  exports: [...ShareModules]
})
export class SharedModule {}
