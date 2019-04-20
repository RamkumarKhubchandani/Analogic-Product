import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { shareReplay, map } from "rxjs/operators";

import { environment as env } from "../../../../environments/environment";
/**
 * @author Hardik Pithva
 */
const TOKEN = "token";
const ROLE = "role";
const EXPIRE = "expires_at";
const APP_SUB = "app-sub";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    const body = new HttpParams()
      .set(`username`, username)
      .set(`password`, password);
      
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
   
    return this.http.post(env.login, body.toString(), { headers }).pipe(
      shareReplay(),
      map((resp: Response) => {
        const status = resp.status || false;
        const role= resp.role;
        this.setRole(role);

        if (status) {
          localStorage.setItem(APP_SUB, username);
          this.setToken(resp.token);
        }
        return status;
      })
    );
  }

  logout = () => {
    this.removeItemsFromStorage([ROLE, TOKEN, EXPIRE, APP_SUB]);
    this.router.navigate(["/login"]);
  };

  getToken = () => localStorage.getItem(TOKEN);

  getSubject = () => localStorage.getItem(APP_SUB);

  setRole = (role: string) => localStorage.setItem(ROLE, btoa(role));

  getRole = () =>localStorage.getItem(ROLE);
  
  setToken = (token: string) => localStorage.setItem(TOKEN, token);

  private removeItemsFromStorage = (items: string[]) =>
    items.forEach(item => localStorage.removeItem(item));
}

interface Response {
  status: boolean;
  role:string;
  token?: string;
  message: string;
}
