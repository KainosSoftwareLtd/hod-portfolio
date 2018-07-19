import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ProjectsOverviewComponent } from '../projects-overview/projects-overview.component';
import { LinksComponent } from '../links/links.component';
import { ProjectListViewsComponent } from '../project-list-views/project-list-views.component';
import { ProjectListViewComponent } from '../project-list-view/project-list-view.component';
import { ProjectListDetailedViewComponent } from '../project-list-detailed-view/project-list-detailed-view.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        ProjectsOverviewComponent,
        LinksComponent,
        ProjectListViewsComponent,
        ProjectListViewComponent,
        ProjectListDetailedViewComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
