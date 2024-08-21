import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorefrontPage } from './storefront.page';
import { RawgService } from 'src/app/services/rawg.service';
import { CartService } from 'src/app/services/cart.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseMockConfig } from 'src/app/testing/firebase.mock';

describe('StorefrontPage', () => {
  let component: StorefrontPage;
  let fixture: ComponentFixture<StorefrontPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorefrontPage ],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        AngularFireModule.initializeApp(firebaseMockConfig),
        AngularFirestoreModule,
      ],
      providers: [
        RawgService,
        CartService,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorefrontPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
