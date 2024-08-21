import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementsPage } from './achievements.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RawgService } from 'src/app/services/rawg.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

describe('AchievementsPage', () => {
  let component: AchievementsPage;
  let fixture: ComponentFixture<AchievementsPage>;
  let rawgServiceMock: any;
  let firestoreMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    rawgServiceMock = {
      getGameAchievements: jasmine.createSpy('getGameAchievements').and.returnValue(of({ results: [] }))
    };

    firestoreMock = {
      collection: jasmine.createSpy('collection').and.callFake(() => ({
        doc: jasmine.createSpy('doc').and.callFake(() => ({
          collection: jasmine.createSpy('collection').and.callFake(() => ({
            get: jasmine.createSpy('get').and.returnValue(of({
              forEach: (callback: Function) => {
                callback({ data: () => ({ name: 'Achievement 1', completed: true }) });
              }
            })),
            doc: jasmine.createSpy('doc').and.callFake(() => ({
              set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
            }))
          }))
        }))
      }))
    };

    authServiceMock = {
      user$: of({ uid: 'testUserId' })
    };

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

  it('should initialize with game ID and load achievements', () => {
    expect(component.gameId).toBe('testGameId');
    expect(rawgServiceMock.getGameAchievements).toHaveBeenCalledWith('testGameId', 1);
  });

  it('should load achievements and call loadUserAchievements', () => {
    const achievements = { results: [{ name: 'Achievement 1' }, { name: 'Achievement 2' }], next: null };
    rawgServiceMock.getGameAchievements.and.returnValue(of(achievements));

    component.loadAchievements();
    expect(component.achievements.length).toBe(2);
    expect(component.achievements).toEqual(achievements.results);
    expect(rawgServiceMock.getGameAchievements).toHaveBeenCalledWith('testGameId', 1);
  });

  it('should load user achievements and mark them as completed', () => {
    const achievements = { results: [{ name: 'Achievement 1' }, { name: 'Achievement 2' }], next: null };
    const userAchievement = { name: 'Achievement 1', completed: true };
    const snapshotMock = {
      forEach: (callback: (doc: any) => void) => callback({ data: () => userAchievement })
    };

    rawgServiceMock.getGameAchievements.and.returnValue(of(achievements));
    firestoreMock.collection().doc().collection().get.and.returnValue(of(snapshotMock));

    component.loadAchievements();
    component.loadUserAchievements();

    expect(component.achievements[0].completed).toBe(true);
    expect(component.achievements[1].completed).toBeUndefined();
  });
});
