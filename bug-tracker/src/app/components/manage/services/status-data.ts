import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:"root"
})

export class StatusService{
    private apiUrl = `http://localhost:5000`;
    constructor(private http: HttpClient){}

    getStatus():Observable<any>{
        return this.http.get(`${this.apiUrl}/status`);
    }

    addStatus(status:any):Observable<any>{
        return this.http.post(`${this.apiUrl}/add-status`,status);
    }

    deleteStatus(id:any):Observable<any>{
        return this.http.delete(`${this.apiUrl}/status/${id}`);
    }

    updateStatus(id:number,status:any){
        return this.http.put(`${this.apiUrl}/status/${id}`,status);
    }
}