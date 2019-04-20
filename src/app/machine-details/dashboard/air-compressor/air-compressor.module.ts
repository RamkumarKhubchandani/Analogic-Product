import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../../shared/modules/shared.module";
import {AirCompressorRoutingRoutingModule} from "./air-compressor.routing.module"
import {AirCompressorComponent} from "./air-compressor.component"

import {AirCompressorService} from "./air-compressor.service"
 
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AirCompressorRoutingRoutingModule
  ],
  declarations: [AirCompressorComponent],
  providers : [AirCompressorService]
})
export class AirCompressorModule { }
