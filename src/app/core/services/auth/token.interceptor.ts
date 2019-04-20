import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs/observable";

import { AuthService } from "./auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private inject: Injector) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
  
    if (!request.url.endsWith("login")) {
      if(request.url.endsWith("/pdf") && (request.method==='POST'||request.method==='PUT')){
        const auth = this.inject.get(AuthService);
        request = request.clone({
          setHeaders: {      
             Authorization: auth.getToken(),
            "App-Subject": auth.getSubject(),
            "cache-control": "no-cache"
          }
        });
      }else{
        const auth = this.inject.get(AuthService);
        request = request.clone({
          setHeaders: {
            "Content-Type": "application/json",
            Authorization: auth.getToken(),
            "App-Subject": auth.getSubject(),
            "cache-control": "no-cache"
          }
        });
      }
    }
    return next.handle(request);
  }
}
