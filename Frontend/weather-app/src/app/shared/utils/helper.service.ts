import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private baseUrl = environment.RootApiUrl;

  constructor(private http: HttpClient) { }

  //#region API Calls
  APIGet(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${url}`);
  }


  APIPost(url: string, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${url}`, body)
  }


  APIPut(url: string, body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${url}`, body);
  }


  APIDelete(url: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${url}`);
  }

  //#endregion

}
