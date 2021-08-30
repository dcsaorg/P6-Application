import { Component, OnInit } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  isLoading: boolean = false;
  userName: string = "";
  password: string = "";
  accessToken: string;
  sessionUserAttributes: any;
  cognitoUser: any;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onSignIn(form: NgForm){
    if (form.valid) {
      this.isLoading = true;
      console.log(this.userName,this.password)
      let authenticationDetails = new AuthenticationDetails({
          Username: this.userName,
          Password: this.password,
      });
     
      let poolData = {
        UserPoolId: environment.cognitoUserPoolId,
        ClientId: environment.cognitoAppClientId 
      };

      let userPool = new CognitoUserPool(poolData);
      let userData = {
        Username: this.userName,
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
          this.isLoading = false;
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          this.sessionUserAttributes = userAttributes;
          //  \n check notes for issue 21
          alert("Confirmation of password is not implemented");
          this.isLoading = false;     
        },
    });
    }
    else{
      console.log("invalid")
    }
  }

}
