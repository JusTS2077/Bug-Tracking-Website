import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn:"root"
})

export class UserGroupServices{
    constructor(private http:HttpClient){}

    getPerms(){
        return this.http.get(`http://localhost:5000/perms`);
    }

    
}