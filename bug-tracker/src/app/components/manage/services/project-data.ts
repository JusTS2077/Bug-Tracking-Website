import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:"root"
})

export class ProjectService{
    private apiUrl = `http://localhost:5000`;
    constructor(private http: HttpClient){}

    getProjects():Observable<any>{
        return this.http.get(`${this.apiUrl}/projects`);
    }

    addProject(project:any):Observable<any>{
        return this.http.post(`${this.apiUrl}/add-project`,project);
    }

    deleteProject(id:number):Observable<any>{
        return this.http.delete(`${this.apiUrl}/projects/${id}`);
    }

    updateProject(id:number,project:any){
        return this.http.put(`${this.apiUrl}/projects/${id}`,project);
    }
}