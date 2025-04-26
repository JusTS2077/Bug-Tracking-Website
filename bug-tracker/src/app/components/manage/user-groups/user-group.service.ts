import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn:"root"
})

export class UserGroupServices{
    constructor(private http:HttpClient){}

    getPerms():Observable<any>{
        return this.http.get(`http://localhost:5000/perms`);
    }

    addGroup(groupnm:any,perms:any):Observable<any>{
        return this.http.post(`http://localhost:5000/add-group`,{groupnm,perms});
    }

    getGroup():Observable<any>{
        return this.http.get('http://localhost:5000/user-groups');
    }
    
    getGroupPerms(id:number):Observable<any>{
        return this.http.get(`http://localhost:5000/group-perms/${id}`);
    }
}