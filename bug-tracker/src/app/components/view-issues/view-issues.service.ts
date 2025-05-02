import { Injectable } from "@angular/core";
import { HttpClient, HttpParams,HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class ViewIssuesService{
    constructor(private http:HttpClient){}

    updateIssues(id:number,issue:any):Observable<any>{
        return this.http.put(`http://localhost:5000/issues/${id}`,issue);
    }

    getIssues(issue_filter: any): Observable<any> {
        let params = new HttpParams();
        for (let key in issue_filter) {
          if (issue_filter[key]) {
            params = params.set(key, issue_filter[key]);
          }
        }
      
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      
        return this.http.get('http://localhost:5000/issue-filter', { params, headers });
      }

    getFile(issueid: number,fileid:number): Observable<Blob> {
        return this.http.get(`http://localhost:5000/view-file/${issueid}/${fileid}`, { responseType: 'blob' });
    }
}