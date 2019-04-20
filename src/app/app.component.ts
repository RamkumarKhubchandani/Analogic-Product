import { Component, HostListener } from "@angular/core";

import { AuthService } from "./core/services/auth/auth.service";

@Component({
  selector: "analogic-dashboard",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private auth: AuthService) {}

  // @HostListener("window:unload", ["$event"])
  // beforeunloadHandler(event) {
  //   // this.auth.logout();
  // }
}
