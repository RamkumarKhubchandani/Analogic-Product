import { Injectable } from "@angular/core";
import { CanLoad, Route, Router } from "@angular/router";

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private route: Router) {}

  canLoad(route: Route) {
    if (!localStorage.getItem("token")) {
      this.route.navigate(["/login"]);
    }
    return true;
  }
}
