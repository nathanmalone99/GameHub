import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

describe('AuthService', () => {
  let service: AuthService;
  let angularFireAuthSpy: jasmine.SpyObj<AngularFireAuth>;
  let angularFirestoreSpy: jasmine.SpyObj<AngularFirestore>;
  let angularFirestoreCollectionSpy: jasmine.SpyObj<AngularFirestoreCollection<unknown>>;

  beforeEach(() => {
    angularFireAuthSpy = jasmine.createSpyObj('AngularFireAuth', ['createUserWithEmailAndPassword', 'signInWithEmailAndPassword']);
    angularFirestoreCollectionSpy = jasmine.createSpyObj('AngularFirestoreCollection', ['doc']);
    angularFirestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection']);
    angularFirestoreSpy.collection.and.returnValue(angularFirestoreCollectionSpy);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: angularFireAuthSpy },
        { provide: AngularFirestore, useValue: angularFirestoreSpy },
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userCredential: firebase.auth.UserCredential = {
      user: { uid: '123' } as firebase.User,
      credential: null,
      operationType: '',
      additionalUserInfo: null
    };
    angularFireAuthSpy.createUserWithEmailAndPassword.and.returnValue(Promise.resolve(userCredential));

    const result = await service.register(email, password);
    expect(result.user!.uid).toEqual('123');
    expect(angularFireAuthSpy.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
  });

  it('should login a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const userCredential: firebase.auth.UserCredential = {
      user: { uid: '123' } as firebase.User,
      credential: null,
      operationType: '',
      additionalUserInfo: null
    };
    angularFireAuthSpy.signInWithEmailAndPassword.and.returnValue(Promise.resolve(userCredential));

    const result = await service.login(email, password);
    expect(result.user!.uid).toEqual('123');
    expect(angularFireAuthSpy.signInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
  });

  /* it('should update user profile', async () => {
    const user: firebase.User = { uid: '123', email: 'test@example.com' } as firebase.User;
    const username = 'testuser';
    const firstName = 'Test';
    const lastName = 'User';

    const docSpy = jasmine.createSpyObj('doc', ['set']);
    angularFirestoreCollectionSpy.doc.and.returnValue(docSpy);
    angularFirestoreSpy.collection.and.returnValue(angularFirestoreCollectionSpy);

    await service.updateUserProfile(user, username, firstName, lastName);
    expect(angularFirestoreSpy.collection).toHaveBeenCalledWith('users');
    expect(angularFirestoreCollectionSpy.doc).toHaveBeenCalledWith(user.uid);
    expect(docSpy.set).toHaveBeenCalledWith({
      uid: user.uid,
      email: user.email,
      username: username,
      firstName: firstName,
      lastName: lastName
    });
  }); */
});
