import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn:"root"
})

export class AuthService{
    
    private apiUrl = "http://localhost:5000";

    private decodedToken: any;
  
    constructor(private http:HttpClient) {
      const token = this.getToken();
      if (token) {
        try {
          this.decodedToken = jwtDecode(token);
        } catch {
          this.decodedToken = null;
        }
      }
    }

    login(user:string,password:string){
        return this.http.post<{token:string}>(`${this.apiUrl}/login`,{user,password});
    }

    saveToken(token:string){
        localStorage.setItem('token',token);
    }

    getToken():string | null{
        return localStorage.getItem('token');
    }

    getDecodedToken() {
        return this.decodedToken;
      }

    logout(){
        localStorage.removeItem('token');
    }
}


  
