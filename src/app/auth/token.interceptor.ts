import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // per verificare se l'utente c'è e quindi se c'è il token
import { switchMap, take } from 'rxjs/operators';  // l'operatore take emette il primo valore count che sta tra () e quindi gli diremo take 1 in modo che per ogni client che entra va a leggere il signolo local storage
                                                    // switchmap emette il valore dalla partenza all'arrivo pendendo sempre l'utlimo valore


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authSrv: AuthService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return this.authSrv.user$.pipe(
            take(1),
            switchMap(user => {
                if (user) {
                    const newReq = request.clone({
                        headers: request.headers.append('Authorization', `Bearer ${localStorage.getItem('user')}`)
                    });
                    return next.handle(newReq);
                } else {
                  
                    return next.handle(request);
                }
            })
        );
    }
}