import { Injectable,OnInit } from '@angular/core';
import { Router } from '@angular/router'

const MINUTES_UNITL_AUTO_LOGOUT = 15 // in mins
const CHECK_INTERVAL = 150000 // in ms
const STORE_KEY = 'lastAction';
@Injectable()
export class AutoLogoutService {

  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }
  
  constructor(private router: Router) {  
  this.check();
  this.initListener();
  this.initInterval;
}
 

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval = setInterval(() => {
    this.check();
  }, CHECK_INTERVAL);

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;

    const isTimeout = diff < 0;
    if (isTimeout) {
      localStorage.clear();
      if (this.initInterval) {
        clearInterval(this.initInterval);
     }
      this.router.navigate(["/login"]);
    }
  }
}