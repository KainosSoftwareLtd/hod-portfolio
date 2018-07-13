import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { ProjectListViewComponent } from './project-list-view/project-list-view.component';
import { ProjectListDetailedViewComponent } from './project-list-detailed-view/project-list-detailed-view.component';
import { ProjectsOverviewComponent } from './projects-overview/projects-overview.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ProjectListViewComponent,
        ProjectListDetailedViewComponent,
        ProjectsOverviewComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  /*
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to project-dashboard!');
  }));
  */
});
