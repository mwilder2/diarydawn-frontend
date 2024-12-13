import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Profile } from '../models/profile.models';
import { Observable, map, tap } from 'rxjs';
import { EmailHeroResponse } from '../../hero/models/hero.models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private PROFILE_ENDPOINT = environment.profileUrl;

  constructor(private http: HttpClient) {
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.PROFILE_ENDPOINT}getprofile`)
  }


  updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(
      `${this.PROFILE_ENDPOINT}update/${profile.id}`,
      profile
    );
  }

  uploadProfileImage(file: File): Observable<EmailHeroResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<EmailHeroResponse>(`${this.PROFILE_ENDPOINT}upload-profile-image`, formData);
  }
}