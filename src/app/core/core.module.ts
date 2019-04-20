import { ErrorHandler, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { MaterialModule } from "../material/material.module";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { AuthService } from "./services/auth/auth.service";
import { AuthGuard } from "./services/auth/auth-guard.service";
import { GlobalErrorHandler } from "./services/error-handler";
import { NotificationService } from "./services/notification.service";

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [ToolbarComponent],
  exports: [ToolbarComponent],
  providers: [
    AuthGuard,
    AuthService,
    GlobalErrorHandler,
    NotificationService,    
  ]
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule
    };
  }
}
