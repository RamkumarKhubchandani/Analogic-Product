import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from "@angular/cdk/layout";
import { Menu ,MACHINE_DASHBOARD_MENU_ITEMS,MACHINE_REPORT_MENU_ITEM,CONFIGURATION_MENU_ITEMS} from "../data";

const OPERATOR_MENU_GAP_LARGE = 64;
const OPERATOR_MENU_GAP_SMALL = 54;

@Component({
  selector: 'app-machine-details',
  templateUrl: './machine-details.component.html',
  styleUrls: ['./machine-details.component.scss']
})
export class MachineDetailsComponent implements OnInit {
  menus = [...MACHINE_DASHBOARD_MENU_ITEMS,...MACHINE_REPORT_MENU_ITEM,...CONFIGURATION_MENU_ITEMS]
  constructor(private breakpointObserver: BreakpointObserver) { }

  get extraSmallScreen() {
    return this.breakpointObserver.isMatched("(max-width: 601px)");
  }

  get menuGap() {
    return this.extraSmallScreen
      ? OPERATOR_MENU_GAP_SMALL
      : OPERATOR_MENU_GAP_LARGE;
  }

  ngOnInit() {
      console.log("hi");
  }
  
  get sideNavMode() {
    return this.smallScreen ? "over" : "side";
  }

  get smallScreen() {
    return this.breakpointObserver.isMatched("(max-width: 901px)");
  }

}
