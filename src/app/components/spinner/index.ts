import { NgModule, Component, Input } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html"  
})
export class SpinnerComponent {
  @Input() stroke: number = 4;
  @Input() diameter: number = 36;
}

@NgModule({
  imports: [MatProgressSpinnerModule],
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent]
})
export class SpinnerModule {}
