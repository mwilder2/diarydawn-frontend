import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userUrl = environment.userUrl;

  constructor(
    private http: HttpClient,
  ) {
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.userUrl}getuser`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.userUrl}adduser`, user);
  }

  updateUser(user: User): Observable<{ user: User; message: string }> {
    return this.http.put<{ user: User; message: string }>(
      `${this.userUrl}updateuser`,
      user
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.userUrl}changepassword`, {
      oldPassword,
      newPassword,
    });
  }
}
