import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:"root"
})

export class PriorityService{
    private apiUrl = `http://localhost:5000`;
    constructor(private http: HttpClient){}

    getPriorities():Observable<any>{
        return this.http.get(`${this.apiUrl}/priorities`);
    }

    addPriority(tag:any):Observable<any>{
        return this.http.post(`${this.apiUrl}/add-priority`,tag);
    }

    deletePriority(id:number):Observable<any>{
        return this.http.delete(`${this.apiUrl}/priorities/${id}`);
    }

    updatePriority(id:number,priority:any){
        return this.http.put(`${this.apiUrl}/priority/${id}`,priority);
    }
}