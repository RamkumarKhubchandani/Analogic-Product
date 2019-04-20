import { Injectable } from "@angular/core";
import {
  Menu,
  CONFIGURATION_MENU_ITEMS,
  DASHBOARD_MENU_ITEMS,
  REPORT_MENU_ITEM,
  ROLES
} from "../data";
import { RestApi } from "../core/services/rest.service";
import { Observable } from "rxjs/Observable";

@Injectable()
export class DashboardService {
  constructor(private _rest: RestApi) {}

  getMenu() {
    let menu: Menu[] = [];

    const role: string = atob(localStorage.getItem('role'));

    switch (role) {
      case ROLES.USER:
        menu.push(...DASHBOARD_MENU_ITEMS,...REPORT_MENU_ITEM,...CONFIGURATION_MENU_ITEMS);
        break;

      case ROLES.ADMIN:
        menu.push(
          ...DASHBOARD_MENU_ITEMS,
          ...REPORT_MENU_ITEM,
          ...CONFIGURATION_MENU_ITEMS
        );
        break;

      case ROLES.PARTICIPANT: 
      menu.push(...DASHBOARD_MENU_ITEMS);
      break;
      
      case ROLES.SUPERADMIN:
      menu.push(
        ...DASHBOARD_MENU_ITEMS,
        ...REPORT_MENU_ITEM,
        ...CONFIGURATION_MENU_ITEMS
      );
      break;

      default:
      menu = DASHBOARD_MENU_ITEMS;
      break;
    }
    return menu;
  }
}
