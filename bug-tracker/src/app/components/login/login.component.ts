import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls:['../../../app/styles/login.component.scss']
})
export class LoginComponent {

  username:string="";
  password:string="";

  constructor(private router:Router,private authservice:AuthService){}

  login(){
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
