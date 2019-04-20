import { Component } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Menu } from "../data";
import { DashboardService } from "./dashboard.service";
import { AuthService } from "../core/services/auth/auth.service"; 

const OPERATOR_MENU_GAP_LARGE = 64;
const OPERATOR_MENU_GAP_SMALL = 54;
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent {
  menus: Menu[] = this.dashboard.getMenu();
  hideMenu:boolean=true;
  constructor(private breakpointObserver: BreakpointObserver,private dashboard: DashboardService,private user: AuthService) {

    this.hideMenu=true;
    let role=this.user.getRole();
    if(atob(role)=='SUPERADMIN'){
      this.hideMenu=false;
    }  // user,report and associated machine configurations show only for super admin..... 
  }

  get extraSmallScreen() {
    return this.breakpointObserver.isMatched("(max-width: 601px)");
  }

  get menuGap() {
    return this.extraSmallScreen
      ? OPERATOR_MENU_GAP_SMALL
      : OPERATOR_MENU_GAP_LARGE;
  }

  get sideNavMode() {
    return this.smallScreen ? "over" : "side";
  }

  get smallScreen() {
    return this.breakpointObserver.isMatched("(max-width: 901px)");
  }
}
