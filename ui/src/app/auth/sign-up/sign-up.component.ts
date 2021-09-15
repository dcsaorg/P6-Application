import { Component, OnInit } from '@angular/core';
import { CognitoUserPool,CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {Globals} from "../../model/portCall/globals";

interface formDataInterface {
  "name": string;
  "family_name": string;
  "email": string;
  "phone_number": string;
  [key: string]: string;
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  isLoading:boolean = false;
  firstName:string = '';
  lastName:string = '';
  email:string = '';
  mobileNo:string = '';
  password:string = '';

  constructor(private router: Router, private globals: Globals) { }

  ngOnInit(): void {}

  onSignup(form: NgForm){
    if (form.valid) {
     this.isLoading = true;
console.log(this.firstName ,this.lastName,this.email,
  this.mobileNo,this.password
)
     var poolData = {
       UserPoolId: this.globals.config.cognitoUserPoolId,
       ClientId: this.globals.config.cognitoAppClientId
     };

     var userPool = new CognitoUserPool(poolData);
     
     var attributeList = [];
     
     let formData:formDataInterface = {
       "name": this.firstName,
       "family_name": this.lastName,
       "email": this.email,
       "phone_number": this.mobileNo,
     }

     for (let key  in formData) {
       let attrData = {
         Name: key,
         Value: formData[key]
       }
       console.log(attrData)
       let attribute = new CognitoUserAttribute(attrData);
       attributeList.push(attribute)
     }
     console.log(attributeList)
     userPool.signUp(this.email, this.password, attributeList, [], (
       err,
       result
     ) => {
       this.isLoading = false;
       if (err) {
         alert(err.message || JSON.stringify(err));
         return;
       }
       this.router.navigate(['/signin']);
     });
    }
   else{
     alert("Invalid")
   }
 }
}