import { Component, OnInit } from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  userName: string = "";
  password: string = "";

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void { }

  onSignIn(form: NgForm){
    if (form.valid) {
      this.authService.logUserIn(this.userName, this.password);
    }
    else{
      console.log("invalid")
    }
  }
}
