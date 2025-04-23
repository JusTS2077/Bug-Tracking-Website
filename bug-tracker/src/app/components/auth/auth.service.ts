import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:"root"
})

export class AuthService{

    private apiUrl = "http://localhost:5000";
    constructor(private http:HttpClient){}

    login(user:string,password:string){
        return this.http.post<{token:string}>(`${this.apiUrl}/login`,{user,password});
    }

    saveToken(token:string){
        localStorage.setItem('token',token);
    }

    getToken():string | null{
        return localStorage.getItem('token');
    }

    logout(){
        localStorage.removeItem('token');
    }
}