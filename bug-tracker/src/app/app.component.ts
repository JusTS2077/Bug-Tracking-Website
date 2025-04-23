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

  }
  ngOnInit(): void {
    this.token = this.auth.getToken();
    if(this.token){
      try{
        this.decodedToken = jwtDecode(this.token);
      }
      catch(err){
        console.error("Failed to decode token:", err);
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    }
    else{
      this.router.navigate(['/login'])
    }
  }

  profileToggle(){
    if(this.userclick === true){
      this.userclick = false;
    }
    else if(this.userclick === false){
      this.userclick = true;
    }
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
    window.location.reload();
  }

}

