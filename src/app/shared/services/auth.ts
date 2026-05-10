import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private auth = getAuth();
  register(email : string, password : string) {}
  login(email : string, password : string) {}
  logout() {}
}
