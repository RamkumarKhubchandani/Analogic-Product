import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CoreModule } from "./core/core.module";
import { MaterialModule } from "./material/material.module";
import { RestApi } from "./core/services/rest.service";
import { SpinnerModule } from "./components/spinner";
import { TokenInterceptor } from "./core/services/auth/token.interceptor";
import { AutoLogoutService} from './auto-logout.service';
import 'hammerjs';
// import { MachineDetailsComponent } from './machine-details/machine-details.component';
// import {MachineDetailsModule } from './machine-details/machine-details.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule.forRoot(),
    FormsModule,
    HttpClientModule,
    MaterialModule,
    SpinnerModule    
  ],
  
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    RestApi,AutoLogoutService
  ]
})
export class AppModule {}
