import { Component, Output, EventEmitter,Input ,OnInit} from "@angular/core";
import { AuthService } from "../services/auth/auth.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  @Output() toggle = new EventEmitter<boolean>();
  @Input() menudisplay: boolean;
  menuBarDisplay : boolean;
  datatoggle = true;
 
  constructor(private auth: AuthService) {
   
  }
  open() {
    this.toggle.emit(true);
  }
  ngOnInit(){
    this.menuBarDisplay = this.menudisplay ? false : true;
  }
  onLogout() {
    this.auth.logout();
  }
  togglemenu(){
    this.datatoggle = !this.datatoggle;

  }

  
}
