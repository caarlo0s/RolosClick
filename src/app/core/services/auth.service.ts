import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';
import { defer, from, Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
 import { FunctionResult } from '../models/function-result.model';
import { AuthUser } from '../models/auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser$: Observable<AuthUser | undefined>;

  constructor(
    private afAuth: AngularFireAuth
  ) {
    this.authUser$ = this.afAuth.user.pipe(
      map((user) =>
        user !== null
          ? <AuthUser>{
              email: user?.email,
              id: user?.uid,
              displayName: user?.displayName,
              emailVerified: user?.emailVerified,
            }
          : undefined
      ),
    );
  }

  logIn(email: string, password: string, rememberMe:boolean): Observable<FunctionResult> {
    let persistence$ = from(this.afAuth.setPersistence(rememberMe ? "local" : "session"));
    let login$ = from(this.afAuth.signInWithEmailAndPassword(email, password));

    return defer (() => persistence$.pipe(
      concatMap(() => login$.pipe(
        map((credential) => {
          const user = credential.user;
          return {
            code: user !== null ? 0 : 1,
            message: user ? 'Inicio de sesión correcto' : 'Error al uniciar sesión',
            result: {
              email: user?.email,
              id: user?.uid,
              emailVerified: user?.emailVerified,
            } as AuthUser,
          };
        }),
        catchError((err) =>
          of({ code: 1, message: 'Usuario o contraseña incorrectos', result: err })
        )
      ))
    ))
  }

  logOut(): Observable<FunctionResult> {
    return defer(() => from(this.afAuth.signOut())).pipe(
      map((val) => {
        return { code: 0, message: 'OK' };
      }),
      catchError((err) => of({ code: 1, message: 'No se puedo cerrar sesión' }))
    );
  }

  loginWithGoogle(rememberMe:boolean): Observable<FunctionResult> {
    const provider = new firebase.default.auth.GoogleAuthProvider();
    let persistence$ = from(this.afAuth.setPersistence(rememberMe ? "local" : "session"));
    let login$ = from(this.authLogin(provider));

    return defer (() => persistence$.pipe(
      concatMap(() => login$.pipe(
        map((credential) => {
          const user = credential.user;
          return {
            code: user !== null ? 0 : 1,
            message: user ? 'Inicio de sesión correcto' : 'Error al uniciar sesión',
            result: {
              email: user?.email,
              id: user?.uid,
              emailVerified: user?.emailVerified,
            } as AuthUser,
          };
        }),
        catchError((err) => {
          return of({ code: 1, message: 'Usuario o contraseña incorrectos', result: err })
        })
      ))
    ))
  }

  public loginWithApple(rememberMe:boolean) {
    const provider = new firebase.default.auth.OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    provider.setCustomParameters({
      locale: 'es',
    });
    let persistence$ = from(this.afAuth.setPersistence(rememberMe ? "local" : "session"));
    let login$ = from(this.authLogin(provider));

    return defer (() => persistence$.pipe(
      concatMap(() => login$.pipe(
        map((credential) => {
          const user = credential.user;
          return {
            code: user !== null ? 0 : 1,
            message: user ? 'Inicio de sesión correcto' : 'Error al uniciar sesión',
            result: {
              email: user?.email,
              id: user?.uid,
              emailVerified: user?.emailVerified,
            } as AuthUser,
          };
        }),
        catchError((err) => {
          return of({ code: 1, message: 'Usuario o contraseña incorrectos', result: err })
        })
      ))
    ))
  }

  // Auth logic to run auth providers
  authLogin(provider: firebase.default.auth.AuthProvider) {
    return this.afAuth.signInWithPopup(provider);
    //   .then((result) => {
    //     console.log('You have been successfully logged in!');
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  // register(user: NewUser): Observable<FunctionResult> {
  //   const fnRegisterUser = this.aff.httpsCallable<NewUser>('users-register');

  //   return fnRegisterUser(user).pipe(
  //     catchError((err: any) =>
  //       of({ code: 1, message: 'Ocurrió un error en el registro del usuario', result: err })
  //     ),
  //     debug(LoggingLevel.DEBUG, 'Register')
  //   );
  // }

  // sendVerificationEmail(data: any) {
  //   return defer(() => from(this.afAuth.currentUser)).pipe(
  //     filter((user) => user !== null),
  //     switchMap((user: any) => from(user.sendEmailVerification(data))),
  //     debug(LoggingLevel.DEBUG, 'verificationEmail')
  //   );
  // }

  // reloadAuthUser() {
  //   return defer(() => from(this.afAuth.currentUser)).pipe(
  //     // filter((user) => user !== null),
  //     switchMap((user: any) => {
  //       if (user) {
  //         return from(user.reload());
  //       } else {
  //         return of(undefined);
  //       }
  //     })
  //   );
  // }

  // handleVerifyEmail(actionCode: string) {
  //   return defer(() => from(this.afAuth.applyActionCode(actionCode))).pipe(
  //     map((val) => 'OK'),
  //     catchError((err) => of('NOK')),
  //     debug(LoggingLevel.DEBUG, 'applyActionCode')
  //   );
  // }
}
