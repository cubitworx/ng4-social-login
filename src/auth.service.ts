import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LoginProvider } from './entities/login-provider';
import { SocialUser } from './entities/user';

export interface AuthServiceConfigItem {
  id: string;
  provider: LoginProvider;
}

export class AuthServiceConfig {
  providers: Map<string, LoginProvider> = new Map<string, LoginProvider>();

  constructor(providers: AuthServiceConfigItem[]) {
    for (let i = 0; i < providers.length; i++) {
      let element = providers[i];
      this.providers.set(element.id, element.provider);
    }
  }
}

@Injectable()
export class AuthService {

  private static readonly LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';

  private providers: Map<string, LoginProvider>;

  private _authState: BehaviorSubject<SocialUser> = new BehaviorSubject(null);

  get authState(): Observable<SocialUser> {
    return this._authState.asObservable();
  }

  constructor(config: AuthServiceConfig) {
    this.providers = config.providers;
  }

  signIn(providerId: string): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      let providerObject = this.providers.get(providerId);
      if (providerObject) {

        providerObject.initialize().then((user: SocialUser) => {
          if (user) {
            user.provider = providerId;
            resolve(user);
            this._authState.next(user);
          } else {
            providerObject.signIn().then((user: SocialUser) => {
              user.provider = providerId;
              resolve(user);
              this._authState.next(user);
            });
          }
        }).catch((err) => {
          // this._authState.next(null);
        });

      } else {
        reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
      }
    });
  }

  signOut(providerId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let providerObject = this.providers.get(providerId);
      providerObject.signOut().then(() => {
        this._authState.next(null);
        resolve();
      }).catch((err) => {
        this._authState.next(null);
      });
    });
  }

}
