import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceStub: any;
  let navCtrlStub: any;

  beforeEach(waitForAsync(() => {
    authServiceStub = {
      login: jasmine.createSpy('login').and.returnValue(Promise.resolve({ user: { uid: '123' } }))
    };

    navCtrlStub = {
      navigateForward: jasmine.createSpy('navigateForward')
    };

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: NavController, useValue: navCtrlStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login a user and navigate to home', async () => {
    component.email = 'test@example.com';
    component.password = 'password123';
    await component.login();
    expect(authServiceStub.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(navCtrlStub.navigateForward).toHaveBeenCalledWith('/home');
  });
});
