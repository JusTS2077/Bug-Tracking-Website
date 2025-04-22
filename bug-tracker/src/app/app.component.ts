import { Component } from "@angular/core";
import { RouterModule,Router,NavigationEnd } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "./components/auth/auth.service";
import { OnInit } from "@angular/core";
import { jwtDecode } from "jwt-decode";
@Component({
  selector: "app-root",
  imports:[RouterModule,CommonModule,FormsModule],
  templateUrl: "./app.component.html",
  styleUrls:["./styles/app.component.scss"],
  standalone:true
})
export class AppComponent implements OnInit{
  activeComp='';
  title = "Bug Tracker";
  isLoginPage:boolean = false;
  token!:any;
  decodedToken!:any;
  userclick=false;

  constructor(public router:Router,private auth:AuthService){
    this.router.events.subscribe(event =>{
      if(event instanceof NavigationEnd){
        this.isLoginPage = this.router.url === "/login";
      }
    });
    this.token = this.auth.getToken();
    this.decodedToken = jwtDecode(this.token);
  }
  ngOnInit(): void {
    
  }

  profileToggle(){
    if(this.userclick === true){
      this.userclick = false;
    }
    else if(this.userclick === false){
      this.userclick = true;
    }
  }

}

