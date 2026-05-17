import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, type User, } from 'firebase/auth';
import { FirebaseService } from '../../core/firebase.service';



@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private auth;
  private readonly provider = new GoogleAuthProvider();

  constructor(private firebaseService: FirebaseService) {
    this.auth = getAuth(this.firebaseService.getApp());
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }


  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);

  }
  
  async loginWithGoogle(): Promise<User> {
    this.provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(this.auth, this.provider);
    return result.user;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }


  onAuthChange(callback: (user: User | null) => void): void {
    onAuthStateChanged(this.auth, callback);
  }

  logout() {
    return signOut(this.auth);
  }
}
