import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListViewsComponent } from './project-list-views.component';
import { ProjectListViewComponent } from '../project-list-view/project-list-view.component';
import { ProjectListDetailedViewComponent } from '../project-list-detailed-view/project-list-detailed-view.component';

describe('ProjectListViewsComponent', () => {
  let component: ProjectListViewsComponent;
  let fixture: ComponentFixture<ProjectListViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectListViewsComponent, ProjectListViewComponent, ProjectListDetailedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
