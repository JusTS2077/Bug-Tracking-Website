import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class ViewIssuesService{
    constructor(private http:HttpClient){}

    updateIssues(id:number,issue:any):Observable<any>{
        return this.http.put(`http://localhost:5000/issues/${id}`,issue);
    }

    getIssues(issue_filter:any):Observable<any>{
        let params = new HttpParams();
        for(let key in issue_filter){
            if(issue_filter[key]){
                params = params.set(key,issue_filter[key]);
            }
        }
        return this.http.get('http://localhost:5000/issue-filter',{params});
    }
}