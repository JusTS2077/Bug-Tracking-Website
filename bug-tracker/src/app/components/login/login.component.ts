import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls:['../../../app/styles/login.component.scss']
})
export class LoginComponent {

  username:string="";
  password:string="";
  token!:any;
  decodedToken!:any;

  constructor(private router:Router,private authservice:AuthService){}

  login(){
    
    this.token = this.authservice.getToken();
    if(this.token){
      try{
        this.decodedToken = jwtDecode(this.token);
      }
      catch(err){
        console.error("Failed to decode token:", err);
        this.authservice.logout();
        this.router.navigate(['/login']);
      }
    }
    else{
      this.router.navigate(['/login'])
    }

    this.authservice.login(this.username,this.password).subscribe({
      next:(res)=>{
        this.authservice.saveToken(res.token);
        alert("Logged in successfully!");
        this.router.navigate(['/manage']);
      },
      error:(err) =>{
        alert("Login failed "+err);
      }
    });
  }

  logout(){
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
}
