import { Component } from "@angular/core";
import { RouterModule,Router,NavigationEnd } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  imports:[RouterModule,CommonModule,FormsModule],
  templateUrl: "./app.component.html",
  styleUrls:["./styles/app.component.scss"],
  standalone:true
})
export class AppComponent {
  activeComp='';
  title = "Bug Tracker";
  isLoginPage:boolean = false;

  constructor(public router:Router){
    this.router.events.subscribe(event =>{
      if(event instanceof NavigationEnd){
        this.isLoginPage = this.router.url === "/login";
      }
    });
  }
}

