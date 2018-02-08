# ng4 Social Login

Social login and authentication module for Angular 4. 
Supports authentication with **Google**, **Linkedin** and **Facebook**.

Forked from [ng4-social-login](https://github.com/sarfarazansari/ng4-social-login) with provider initialisation only happening
when you the user sign's in. The benefit of this is that no provider scripts are not loaded into the DOM until they are needed.

This means that a separate service is needed for managing the user session; but can now manage the user login via other mechanisms
such as local storage, server, etc. It is no longer bound to querying the provider on each page refresh.

The original documentation can be used since the package is consumed in the same manner as the original package.



## Getting started


### Documentation

check out [Docs](https://sarfarazansari.github.io/ng4-social-login/)

### Install via npm 

```sh
npm install --save @cubitworx/ng4-social-login
```

### Import the module

In your `AppModule`, import the `SocialLoginModule`

```javascript
import {
  SocialLoginModule, 
  AuthServiceConfig,
  GoogleLoginProvider, 
  FacebookLoginProvider, 
  LinkedinLoginProvider
} from 'ng4-social-login';

const CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('Google-OAuth-Client-Id')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('Facebook-App-Id')
  },
  {
    id: LinkedinLoginProvider.PROVIDER_ID,
    provider: new LinkedinLoginProvider('LINKEDIN_CLIENT_ID')
  }
]);

export function provideConfig() {
  return CONFIG;
}

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [...]
})
export class AppModule { }
```

### Sign in and out users

```javascript
import { 
  AuthService 
  FacebookLoginProvider, 
  GoogleLoginProvider,
  LinkedinLoginProvider
} from 'ng4-social-login';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor(private authService: AuthService) { }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithLinkedIN(): void {
    this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

}
```

### Subscribe to the authentication state

You are notified when user logs in or logs out. You receive a `SocialUser` object when the user logs in and a `null` when the user logs out. `SocialUser` object contains basic user information such as name, email, photo URL, etc.

```javascript
import { AuthService } from 'ng4-social-login';
import { SocialUser } from 'ng4-social-login';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  private user: SocialUser;
  private loggedIn: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

}
```

### Display the user information

```html
<img src='{{ user.photoUrl }}'>
<div>
  <h4>{{ user.name }}</h4>
  <p>{{ user.email }}</p>
</div>
```

## Building with AoT

If you are facing issue in building your app with AoT, check [this document](https://github.com/sarfarazansari/angular4-social-login/blob/master/README-AOT.md).

## Contributing to project
```sh
you are welcome to report an issue or creating a pull request.
```