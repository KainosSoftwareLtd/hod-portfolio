import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsOverviewComponent } from './projects-overview.component';
import { ProjectService } from '../project.service';

describe('ProjectsOverviewComponent', () => {
  let component: ProjectsOverviewComponent;
  let fixture: ComponentFixture<ProjectsOverviewComponent>;
  let el;

  let projectServiceStub: Partial<ProjectService>;

  beforeEach(async(() => {
    projectServiceStub = {
      getProjects: () => [
        { id: 22, name: 'DVSA', phase: 'Alpha', completedDate: new Date(2018, 5, 18), overall: 'Requires support', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
        { id: 23, name: 'Defra', phase: 'Alpha', completedDate: new Date(2017, 7, 28), overall: 'Significant issues', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
        { id: 24, name: 'Home Office', phase: 'Beta', completedDate: new Date(2018, 4, 10), overall: 'Significant issues', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
        { id: 25, name: 'Land Registry', phase: 'Beta', completedDate: new Date(2018, 3, 18), overall: 'Requires support', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
        { id: 26, name: 'Scottish Courts and Tribunals Service', phase: 'Discovery', completedDate: new Date(2018, 9, 20), overall: 'Significant issues', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
        { id: 27, name: 'FTTS-Alpha Extended', phase: 'Beta', completedDate: null, overall: null, mgnt: null, consulting: null, design: null, engineering: null, ops: null, security: null, data: null, sector: 'private', department: 'Ministry of Justice', agency: 'Her Majesty\'s Prison & Probation Service (HMPPS) (Previously NOMS)', accountName: 'DVSA', themes: 'Delivery Partner Managed, Cloud User Research Azure' }
      ]
    };
    TestBed.configureTestingModule({
      declarations: [ ProjectsOverviewComponent ],
      providers: [ {provide: ProjectService, useValue: projectServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('renders pipeline figure', () => {
    expect(el.querySelector('#projects-overview-pipeline h3').textContent).toContain('Pipeline');
    expect(el.querySelector('#projects-overview-pipeline div').textContent).toContain('0');
  });

  it('renders discovery figure', () => {
    expect(el.querySelector('#projects-overview-discovery h3').textContent).toContain('Discovery');
    expect(el.querySelector('#projects-overview-discovery div').textContent).toContain('1');
  });

  it('renders alpha figure', () => {
    expect(el.querySelector('#projects-overview-alpha h3').textContent).toContain('Alpha');
    expect(el.querySelector('#projects-overview-alpha div').textContent).toContain('2');
  });

  it('renders beta figure', () => {
    expect(el.querySelector('#projects-overview-beta h3').textContent).toContain('Beta');
    expect(el.querySelector('#projects-overview-beta div').textContent).toContain('3');
  });

  it('renders beta to live figure', () => {
    expect(el.querySelector('#projects-overview-betaToLive h3').textContent).toContain('Beta to live');
    expect(el.querySelector('#projects-overview-betaToLive div').textContent).toContain('0');
  });

  it('renders live figure', () => {
    expect(el.querySelector('#projects-overview-live h3').textContent).toContain('Live');
    expect(el.querySelector('#projects-overview-live div').textContent).toContain('0');
  });
});
