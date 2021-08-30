import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth: boolean ;
  accessToken: string;
  sessionUserAttributes: any;
  cognitoUser: any;

  constructor(private router: Router) { }

  isLoggedIn(): boolean {

    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };

    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        this.isAuth = session.isValid()
      })
    }
    return this.isAuth;
  }

logUserOut(){
  let poolData = {
    UserPoolId: environment.cognitoUserPoolId,
    ClientId: environment.cognitoAppClientId
  };
  
  let userPool = new CognitoUserPool(poolData);
  let cognitoUser = userPool.getCurrentUser();
  cognitoUser?.signOut();
  this.router.navigate(["signin"])
}

  getAuthorizationToken(): string {
    
  let poolData = {
    UserPoolId: environment.cognitoUserPoolId,
    ClientId: environment.cognitoAppClientId
  };
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        this.accessToken = session.getAccessToken().getJwtToken();
      })
    }
    return this.accessToken;
  }


  logUserIn(userName, password){

    let authenticationDetails = new AuthenticationDetails({
      Username: userName,
      Password: password,
    });
   
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId 
    };
  
    let userPool = new CognitoUserPool(poolData);
    let userData = {
      Username: userName,
      Pool: userPool,
    };
  
  
    this.cognitoUser = new CognitoUser(userData);
    this.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        this.accessToken = result.getAccessToken().getJwtToken();
        this.router.navigate(["dashboard"])
      },
    
      onFailure: (err) => {
        alert(err.message || JSON.stringify(err));
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        this.sessionUserAttributes = userAttributes;
        //  \n check notes for issue 21
        alert("Confirmation of password is not implemented");
      },
  });
  }

}