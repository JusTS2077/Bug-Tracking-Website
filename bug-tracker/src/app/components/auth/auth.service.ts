import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private apiUrl = "http://localhost:5000";
  private decodedTokenSubject = new BehaviorSubject<any>(null);
  decodedToken$ = this.decodedTokenSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.decodeAndEmitToken(token);
    }
  }

  login(user: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { user, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.decodeAndEmitToken(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private decodeAndEmitToken(token: string) {
    try {
      const decoded = jwtDecode(token);
      this.decodedTokenSubject.next(decoded);
    } catch (err) {
      this.decodedTokenSubject.next(null);
    }
  }

  getDecodedTokenSync() {
    return this.decodedTokenSubject.getValue();
  }

  logout() {
    localStorage.removeItem('token');
    this.decodedTokenSubject.next(null);
  }
}
