import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { ProjectsOverviewComponent } from '../projects-overview/projects-overview.component';
import { ProjectListViewsComponent } from '../project-list-views/project-list-views.component';
import { ProjectListViewComponent } from '../project-list-view/project-list-view.component';
import { ProjectListDetailedViewComponent } from '../project-list-detailed-view/project-list-detailed-view.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OverviewComponent,
        ProjectsOverviewComponent,
        ProjectListViewsComponent,
        ProjectListViewComponent,
        ProjectListDetailedViewComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
