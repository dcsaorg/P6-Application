import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Util {

  constructor() { }

 public static GetEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
  }

}
