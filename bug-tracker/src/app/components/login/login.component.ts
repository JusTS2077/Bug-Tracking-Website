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

  login() {
    this.authservice.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authservice.saveToken(res.token);
        this.token = res.token;
  
        try {
          this.decodedToken = jwtDecode(this.token);
          console.log("Decoded Token:", this.decodedToken);
        } catch (err) {
          console.error("Failed to decode token:", err);
          this.authservice.logout();
          this.router.navigate(['/login']);
          return;
        }
  
        alert("Logged in successfully!");
        this.router.navigate(['/view-issues']);
      },
      error: (err) => {
        alert("Login failed: " + err.message);
      }
    });
  }
  

  logout(){
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
}
