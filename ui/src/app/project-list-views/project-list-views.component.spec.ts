import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListViewsComponent } from './project-list-views.component';
import { ProjectListViewComponent } from '../project-list-view/project-list-view.component';
import { ProjectListDetailedViewComponent } from '../project-list-detailed-view/project-list-detailed-view.component';

describe('ProjectListViewsComponent', () => {
  let component: ProjectListViewsComponent;
  let fixture: ComponentFixture<ProjectListViewsComponent>;
  let el;

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
    el = fixture.nativeElement;
  });

  it('renders default-view by default', () => {
    expect(el.querySelector('#project-list-view').hidden).toBe(false);
    expect(el.querySelector('#project-list-detailed-view').hidden).toBe(true);
  });

  it('renders detailed-view after selecting it', () => {
    el.querySelector('#detailed-view').click();
    fixture.detectChanges();

    expect(el.querySelector('#project-list-view').hidden).toBe(true);
    expect(el.querySelector('#project-list-detailed-view').hidden).toBe(false);
  });

  it('renders default-view after selecting it back', () => {
    el.querySelector('#detailed-view').click();
    fixture.detectChanges();

    el.querySelector('#default-view').click();
    fixture.detectChanges();

    expect(el.querySelector('#project-list-view').hidden).toBe(false);
    expect(el.querySelector('#project-list-detailed-view').hidden).toBe(true);
  });
});
