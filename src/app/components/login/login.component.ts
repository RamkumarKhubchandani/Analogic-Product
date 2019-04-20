import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validator, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { AuthService } from "../../core/services/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  
  login: FormGroup;
  loading: boolean;
  errMessage: string;
  role:string;

  constructor(
    private fb: FormBuilder,
    private user: AuthService,
    private router: Router,
    private error: GlobalErrorHandler
  ) {
    this.login = this.fb.group({
      id: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  onSubmit() {
    if (this.login.valid) {
      this.reset(false);
      const { id, password } = this.login.value;
      
      this.user
        .login(id, btoa(password))
        .subscribe(
          status => { this.getrole(),this.success(status,atob(this.role))},
          err => this.handleError(err)
        );
    }
  }
  
private getrole(){
  this.role=this.user.getRole();
}

  private handleError(err, id = 0) {
    this.reset(true);
    this.errMessage = this.error.getErrorMessage(err.status ? 2 : id);
    this.error.handleError(err);
  }

  private reset(status) {
    this.errMessage = "";
    this.loading = !status;
    status ? this.login.enable() : this.login.disable();
  }

  private success(status, role) {
   
    status
      ? (this.user.setRole(role), this.router.navigate(["/homepage"]))
      : this.handleError("", 2);
  }
}
