import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  private jsonUrl = 'assets/covid.json'

  constructor(private http: HttpClient) { }

  getCovidStatistics(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
}
