import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:"root"
})

export class TagService{
    private apiUrl = `http://localhost:5000`;
    constructor(private http: HttpClient){}

    getTags():Observable<any>{
        return this.http.get(`${this.apiUrl}/tags`);
    }

    addTags(tag:any):Observable<any>{
        return this.http.post(`${this.apiUrl}/add-tag`,tag);
    }

    deleteTag(id:number):Observable<any>{
        return this.http.put(`${this.apiUrl}/tags/${id}`,{});
    }

    updateTag(id:number,tag:any){
        return this.http.put(`${this.apiUrl}/tags/${id}`,tag);
    }
}