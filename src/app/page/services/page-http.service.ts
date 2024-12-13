import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page, TransferPagesDto } from '../models/page.models';

@Injectable({
  providedIn: 'root',
})
export class PageHttpService {
  baseUrl = environment.pageUrl;

  constructor(private http: HttpClient) {
  }

  getPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.baseUrl}getpages`).pipe(
    );
  }

  addPage(pageDto: Partial<Page>): Observable<{ id: number; pageNumber: number; message: string }> {
    return this.http.post<{ id: number; pageNumber: number; message: string }>(
      `${this.baseUrl}create`,
      pageDto
    );
  }

  updatePage(
    pageId: number,
    pageData: Partial<Page>
  ): Observable<{ id: number; pageNumber: number; message: string }> {
    return this.http.put<{ id: number; pageNumber: number; message: string }>(
      `${this.baseUrl}update/` + pageId,
      pageData
    );
  }

  deletePage(pageId: number): Observable<{ id: number; message: string }> {
    return this.http.delete<{ id: number; message: string }>(
      `${this.baseUrl}deletepage/` + pageId
    );
  }

  transferPages(transferPagesDto: TransferPagesDto): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}transferpages/`, transferPagesDto);
  }
}
