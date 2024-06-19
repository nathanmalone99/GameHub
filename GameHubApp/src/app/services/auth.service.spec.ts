import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let angularFireAuthSpy: jasmine.SpyObj<AngularFireAuth>;
  let angularFirestoreSpy: jasmine.SpyObj<AngularFirestore>;

  beforeEach(() => {
    const angularFireAuthSpyObj = jasmine.createSpyObj('AngularFireAuth', ['']);
    const angularFirestoreSpyObj = jasmine.createSpyObj('AngularFirestore', ['']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: angularFireAuthSpyObj },
        { provide: AngularFirestore, useValue: angularFirestoreSpyObj },
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
      ]
    });

    service = TestBed.inject(AuthService);
    angularFireAuthSpy = TestBed.inject(AngularFireAuth) as jasmine.SpyObj<AngularFireAuth>;
    angularFirestoreSpy = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
