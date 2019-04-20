import { Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import {DashboardService} from '../dashboard.service';
import { AutoLogoutService} from './../../auto-logout.service';
@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"]
})
export class DefaultComponent implements OnInit {
  loaded: boolean;
  machineID:number;
  constructor(private ds:DashboardService, private router: Router,private logout:AutoLogoutService) {}
  ngOnInit() {
    localStorage.setItem('lastAction', Date.now().toString());
   
  }

  onCardClick(e) {
    this.goTo(e);
   }

  onSelect(e) {
    this.loaded = false;
    this.machineID=e.machineID;
    setTimeout(() => (this.loaded = true), 500);
  }

  goTo(route: string) {
    this.router.navigate([`dashboard/${route}`]);
  }
}

