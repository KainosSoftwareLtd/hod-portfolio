import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListViewComponent } from './project-list-view.component';
import { ProjectService } from '../project.service';

describe('ProjectListViewComponent', () => {
  let component: ProjectListViewComponent;
  let fixture: ComponentFixture<ProjectListViewComponent>;
  let el;

  let projectServiceStub: Partial<ProjectService>;

  beforeEach(async(() => {
    projectServiceStub = {
      getProjects: () => [
        { id: 22, name: 'DVSA', phase: 'Alpha', completedDate: new Date(2018, 5, 18), overall: 'Requires support', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null },
        { id: 23, name: 'Defra', phase: 'Alpha', completedDate: new Date(2017, 7, 28), overall: 'Significant issues', mgnt: 'Significant issues', consulting: 'Manageable', design: 'Significant issues', engineering: 'Manageable', ops: 'Manageable', security: 'Significant issues', data: 'Requires support', sector: null, department: null, agency: null, accountName: null, themes: null }
      ]
    };
    TestBed.configureTestingModule({
      declarations: [ ProjectListViewComponent ],
      providers: [ {provide: ProjectService, useValue: projectServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('renders phase column', () => {
    expect(el.querySelector('#project-phase').textContent).toContain('Phase');
    expect(el.querySelector('#project-22-phase').textContent).toContain('Alpha');
    expect(el.querySelector('#project-23-phase').textContent).toContain('Alpha');
  });

  it('renders name column', () => {
    expect(el.querySelector('#project-name').textContent).toContain('Project');
    expect(el.querySelector('#project-22-name').textContent).toContain('DVSA');
    expect(el.querySelector('#project-23-name').textContent).toContain('Defra');
  });

  it('renders completedDate column', () => {
    expect(el.querySelector('#project-completedDate').textContent).toContain('Completed date');
    expect(el.querySelector('#project-22-completedDate').textContent).toContain('6/18/18');
    expect(el.querySelector('#project-23-completedDate').textContent).toContain('8/28/17');
  });

  it('renders overall column', () => {
    expect(el.querySelector('#project-overall').textContent).toContain('Overall');
    expect(el.querySelector('#project-22-overall').textContent).toContain('Requires support');
    expect(el.querySelector('#project-23-overall').textContent).toContain('Significant issues');
  });

  it('renders mgnt column', () => {
    expect(el.querySelector('#project-mgnt').textContent).toContain('Mgnt');
    expect(el.querySelector('#project-22-mgnt').textContent).toContain('Significant issues');
    expect(el.querySelector('#project-23-mgnt').textContent).toContain('Significant issues');
  });

  it('renders consulting column', () => {
    expect(el.querySelector('#project-consulting').textContent).toContain('Consulting');
    expect(el.querySelector('#project-22-consulting').textContent).toContain('Manageable');
    expect(el.querySelector('#project-23-consulting').textContent).toContain('Manageable');
  });

  it('renders design column', () => {
    expect(el.querySelector('#project-design').textContent).toContain('Design');
    expect(el.querySelector('#project-22-design').textContent).toContain('Significant issues');
    expect(el.querySelector('#project-23-design').textContent).toContain('Significant issues');
  });

  it('renders engineering column', () => {
    expect(el.querySelector('#project-engineering').textContent).toContain('Engineering');
    expect(el.querySelector('#project-22-engineering').textContent).toContain('Manageable');
    expect(el.querySelector('#project-23-engineering').textContent).toContain('Manageable');
  });

  it('renders ops column', () => {
    expect(el.querySelector('#project-ops').textContent).toContain('Ops');
    expect(el.querySelector('#project-22-ops').textContent).toContain('Manageable');
    expect(el.querySelector('#project-23-ops').textContent).toContain('Manageable');
  });

  it('renders security column', () => {
    expect(el.querySelector('#project-security').textContent).toContain('Security');
    expect(el.querySelector('#project-22-security').textContent).toContain('Significant issues');
    expect(el.querySelector('#project-23-security').textContent).toContain('Significant issues');
  });

  it('renders data column', () => {
    expect(el.querySelector('#project-data').textContent).toContain('Data');
    expect(el.querySelector('#project-22-data').textContent).toContain('Requires support');
    expect(el.querySelector('#project-23-data').textContent).toContain('Requires support');
  });
});
