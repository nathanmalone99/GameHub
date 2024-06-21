import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HomePage } from './home.page';
import { RawgService } from 'src/app/services/rawg.service';
import { SharedModule } from 'src/app/modules/shared/shared.module'; 

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let rawgService: RawgService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, SharedModule],
      providers: [RawgService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    rawgService = TestBed.inject(RawgService);

    spyOn(rawgService, 'getGames').and.returnValue(
      of({
        results: [
          { id: 1, name: 'Game 1', background_image: 'image1.jpg', released: '2020-01-01' },
          { id: 2, name: 'Game 2', background_image: 'image2.jpg', released: '2020-01-02' },
        ],
        count: 100,
      })
    );

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load games on init', () => {
    expect(component.games.length).toBe(2);
    expect(component.totalPages).toBe(5);
  });

  it('should go to the first page', () => {
    component.currentPage = 2;
    component.goToFirstPage();
    fixture.detectChanges();
    expect(component.currentPage).toBe(1);
  });

  it('should go to the last page', () => {
    component.currentPage = 1;
    component.totalPages = 5;
    component.goToLastPage();
    fixture.detectChanges();
    expect(component.currentPage).toBe(5);
  });

  it('should go to the next page', () => {
    component.currentPage = 1;
    component.totalPages = 5;
    component.goToNextPage();
    fixture.detectChanges();
    expect(component.currentPage).toBe(2);
  });

  it('should not go to the next page if on the last page', () => {
    component.currentPage = 5;
    component.totalPages = 5;
    component.goToNextPage();
    fixture.detectChanges();
    expect(component.currentPage).toBe(5);
  });

  it('should go to the previous page', () => {
    component.currentPage = 2;
    component.goToPreviousPage();
    fixture.detectChanges();
    expect(component.currentPage).toBe(1);
  });

  it('should not go to the previous page if on the first page', () => {
    component.currentPage = 1;
    component.goToPreviousPage();
    fixture.detectChanges();
    expect(component.currentPage).toBe(1);
  });

  it('should apply filters', () => {
    component.filters.search = 'Test';
    component.filters.genres = '4';
    component.filters.platforms = '4';
    component.filters.ordering = 'name';
    component.applyFilters();
    fixture.detectChanges();
    expect(component.currentPage).toBe(1);
    expect(rawgService.getGames).toHaveBeenCalledWith(1, 20, component.filters);
  });

  it('should clear filters', () => {
    component.filters = {
      search: 'Test',
      genres: '4',
      platforms: '4',
      ordering: 'name'
    };
    component.clearFilters();
    fixture.detectChanges();
    expect(component.filters).toEqual({
      search: '',
      genres: '',
      platforms: '',
      ordering: ''
    });
    expect(component.currentPage).toBe(1);
    expect(rawgService.getGames).toHaveBeenCalledWith(1, 20, component.filters);
  });
});
