import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServices {

  private apiUrl = 'http://localhost:5000';
  constructor(private http:HttpClient) {}

  addUser(user:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/add-user`,user);
  }

  getUsers():Observable<any>{
    return this.http.get(`${this.apiUrl}/users`);
  }

  deleteUser(userId:number):Observable<any>{
    return this.http.put(`${this.apiUrl}/users/${userId}`,{})
  }

  updateUser(id:number,user:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/users/${id}`,user);
  }
  toggleUser(id:number){
    return this.http.put(`${this.apiUrl}/users/${id}/toggle-status`,{});
  }
}
