import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { of , Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";
import { ProcessHTTPMsgService } from "./process-httpmsg.service"; 

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leaders')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getDish(id: number): Observable<Leader> {
    return this.http.get<Leader>(baseURL + '/leaders' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader() : Observable<number[] | any> {
    return this.http.get<Leader[]>(baseURL + 'leaders?featured=true')
     .pipe(map(leader => leader[0]))
     .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeaderIds(): Observable<number[] | any> {
    return this.getLeaders().pipe(map(leaders => leaders.map(leader => leader.id)))
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

}  
