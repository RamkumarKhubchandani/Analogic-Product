import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import {MachineDetailsComponent} from "./machine-details/machine-details.component"
import { AuthGuard } from "./core/services/auth/auth-guard.service";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "homepage",
    pathMatch: "full"
  },
  {
    path:"homepage",
    loadChildren: "./homepage/homepage.module#HomepageModule",
    // canLoad: [AuthGuard]
    // component :MachineDetailsComponent,
    
  },


  {
    path:"machinedetail",
    loadChildren: "./machine-details/machine-details.module#MachineDetailsModule"    
    // component :MachineDetailsComponent,
    
  },
  {
    path: "ems",
    loadChildren : "./ems/ems.module#EmsModule"
  },
  {
    path: "login",
    loadChildren: "./components/login/login.module#LoginModule"
  },
  {
    path: "dashboard",
    loadChildren: "./dashboard/dashboard.module#DashboardModule",
    // canLoad: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: "homepage"
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
