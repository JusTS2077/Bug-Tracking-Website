import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReportIssueService{
    private apiUrl = `http://localhost:5000`;
    constructor(private http:HttpClient){}

    getStatus():Observable<any>{
      return this.http.get(`${this.apiUrl}/status`);
    }

    getUsers():Observable<any>{
      return this.http.get(`${this.apiUrl}/users`);
    }

    getTags():Observable<any>{
      return this.http.get(`${this.apiUrl}/tags`);
    }

    getProjects():Observable<any>{
      return this.http.get(`${this.apiUrl}/projects`);
    }
    getPriorities():Observable<any>{
      return this.http.get(`${this.apiUrl}/priorities`);
    }
    addIssue(issue:FormData):Observable<any>{
      return this.http.post(`${this.apiUrl}/add-issue`,issue);
    }

}