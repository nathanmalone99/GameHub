import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupPage } from './signup.page';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register', 'updateUserProfile']);
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
    const angularFireAuthSpy = jasmine.createSpyObj('AngularFireAuth', ['']);
    const angularFirestoreSpy = jasmine.createSpyObj('AngularFirestore', ['']);

    await TestBed.configureTestingModule({
      declarations: [SignupPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: NavController, useValue: navSpy },
        { provide: AngularFireAuth, useValue: angularFireAuthSpy },
        { provide: AngularFirestore, useValue: angularFirestoreSpy },
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
      ]
    }).compileComponents();

    console.log('Firebase Config:', environment.firebase); 
    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    navCtrlSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService register and updateUserProfile on signup', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const username = 'testuser';
    const firstName = 'Test';
    const lastName = 'User';

    component.email = email;
    component.password = password;
    component.username = username;
    component.firstName = firstName;
    component.lastName = lastName;

    const userCredential = {
      user: {
        uid: '123',
        email: email
      }
    } as firebase.auth.UserCredential;

    authServiceSpy.register.and.returnValue(Promise.resolve(userCredential));
    authServiceSpy.updateUserProfile.and.returnValue(Promise.resolve());

    await component.signup();

    expect(authServiceSpy.register).toHaveBeenCalledWith(email, password);
    if (userCredential.user) {
      expect(authServiceSpy.updateUserProfile).toHaveBeenCalledWith(userCredential.user, username, firstName, lastName);
    }
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/home');
  });
});
