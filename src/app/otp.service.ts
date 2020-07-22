import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { httpResponse } from './interfaces';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class OtpService {

    constructor(private http: HttpClient) { }

    getOTP(data): Observable<httpResponse> {
        return this.http.post<httpResponse>('http://lab.thinkoverit.com/api/getOTP.php', JSON.stringify(data))
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError('server error');
                })
            )
    }

    verifyOTP(data): Observable<httpResponse> {
        return this.http.post<httpResponse>('http://lab.thinkoverit.com/api/verifyOTP.php', JSON.stringify(data))
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError('server error');
                })
            )
    }

}
