import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { BreakpointObserver } from "@angular/cdk/layout";
import { Menu , EMS_DASHBOARD_MENU_ITEMS, EMS_REPORT_MENU_ITEM, CONFIGURATION_MENU_ITEMS} from "../data";
import { NewPdfComponent } from '../new-pdf/new-pdf.component';
import {
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory} from '@angular/core';
const OPERATOR_MENU_GAP_LARGE = 64;
const OPERATOR_MENU_GAP_SMALL = 54;
@Component({
  selector: 'app-ems',
  templateUrl: './ems.component.html',
  styleUrls: ['./ems.component.scss']
})

export class EmsComponent implements OnInit {
  menus = [...EMS_DASHBOARD_MENU_ITEMS,...EMS_REPORT_MENU_ITEM,...CONFIGURATION_MENU_ITEMS]
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
      console.log("EMS component Loaded.....");
  }

  get sideNavMode() {
    return this.smallScreen ? "over" : "side";
  }

  get smallScreen() {
    return this.breakpointObserver.isMatched("(max-width: 901px)");
  }

}
