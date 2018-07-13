import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListDetailedViewComponent } from './project-list-detailed-view.component';
import { ProjectService } from '../project.service';

describe('ProjectListDetailedViewComponent', () => {
  let component: ProjectListDetailedViewComponent;
  let fixture: ComponentFixture<ProjectListDetailedViewComponent>;
  let el;

  let projectServiceStub: Partial<ProjectService>;

  beforeEach(async(() => {
    projectServiceStub = {
      getProjects: () => [
        { id: 27, name: 'FTTS-Alpha Extended', phase: 'Alpha', completedDate: null, overall: null, mgnt: null, consulting: null, design: null, engineering: null, ops: null, security: null, data: null, sector: 'private', department: 'Ministry of Justice', agency: 'Her Majesty\'s Prison & Probation Service (HMPPS) (Previously NOMS)', accountName: 'DVSA', themes: 'Delivery Partner Managed, Cloud User Research Azure' },
        { id: 30, name: 'Test-Project', phase: 'Beta', completedDate: null, overall: null, mgnt: null, consulting: null, design: null, engineering: null, ops: null, security: null, data: null, sector: 'public', department: 'Ministry of Defence', agency: 'Probation Service', accountName: 'Account', themes: 'Test themes' },
      ]
    };
    TestBed.configureTestingModule({
      declarations: [ ProjectListDetailedViewComponent ],
      providers: [ {provide: ProjectService, useValue: projectServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('renders phase column', () => {
    expect(el.querySelector('#project-phase').textContent).toContain('Phase');
    expect(el.querySelector('#project-27-phase').textContent).toContain('Alpha');
    expect(el.querySelector('#project-30-phase').textContent).toContain('Beta');
  })

  it('renders sector column', () => {
    expect(el.querySelector('#project-sector').textContent).toContain('Sector');
    expect(el.querySelector('#project-27-sector').textContent).toContain('private');
    expect(el.querySelector('#project-30-sector').textContent).toContain('public');
  })

  it('renders department column', () => {
    expect(el.querySelector('#project-department').textContent).toContain('Department');
    expect(el.querySelector('#project-27-department').textContent).toContain('Ministry of Justice');
    expect(el.querySelector('#project-30-department').textContent).toContain('Ministry of Defence');
  })

  it('renders agency column', () => {
    expect(el.querySelector('#project-agency').textContent).toContain('Agency');
    expect(el.querySelector('#project-27-agency').textContent).toContain('Her Majesty\'s Prison & Probation Service (HMPPS) (Previously NOMS)');
    expect(el.querySelector('#project-30-agency').textContent).toContain('Probation Service');
  })

  it('renders accountName column', () => {
    expect(el.querySelector('#project-accountName').textContent).toContain('Account name');
    expect(el.querySelector('#project-27-accountName').textContent).toContain('DVSA');
    expect(el.querySelector('#project-30-accountName').textContent).toContain('Account');
  })

  it('renders name column', () => {
    expect(el.querySelector('#project-name').textContent).toContain('Project');
    expect(el.querySelector('#project-27-name').textContent).toContain('FTTS-Alpha Extended');
    expect(el.querySelector('#project-30-name').textContent).toContain('Test-Project');
  })

  it('renders themes column', () => {
    expect(el.querySelector('#project-themes').textContent).toContain('Themes');
    expect(el.querySelector('#project-27-themes').textContent).toContain('Delivery Partner Managed, Cloud User Research Azure');
    expect(el.querySelector('#project-30-themes').textContent).toContain('Test themes');
  })

});
