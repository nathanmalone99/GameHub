import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementsPage } from './achievements.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RawgService } from 'src/app/services/rawg.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

const rawgServiceMock = {
  getGameAchievements: jasmine.createSpy('getGameAchievements').and.returnValue(of({ results: [] }))
};

const firestoreMock = {
  collection: jasmine.createSpy('collection').and.returnValue({
    doc: jasmine.createSpy('doc').and.returnValue({
      collection: jasmine.createSpy('collection').and.returnValue({
        get: jasmine.createSpy('get').and.returnValue(of({})),
        set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
      })
    })
  })
};

const authServiceMock = {
  user$: of({ uid: 'testUserId' })
};

describe('AchievementsPage', () => {
  let component: AchievementsPage;
  let fixture: ComponentFixture<AchievementsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AchievementsPage],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'testGameId' } } } },
        { provide: RawgService, useValue: rawgServiceMock },
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
