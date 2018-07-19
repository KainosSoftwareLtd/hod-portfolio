import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RouterLinkDirectiveStub } from '../router-link-directive-stub.directive';

import { LinksComponent } from './links.component';

describe('LinksComponent', () => {
  let component: LinksComponent;
  let fixture: ComponentFixture<LinksComponent>;
  let el;

  let linkDebugElements;
  let routerLinks;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinksComponent, RouterLinkDirectiveStub ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;

    // find DebugElements with an attached RouterLinkStubDirective
    linkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances using each DebugElement's injector
    routerLinks = linkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('has got \'Add a project\' link', () => {
    expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
    expect(routerLinks[0].linkParams).toBe('/add-a-project');
    expect(el.querySelector('#add-a-project-link').textContent).toEqual('Add a project');
  });

  it('navigates to add a project page on \'Add a project\' click', () => {
    const addAProjectLinkDebugElement = linkDebugElements[0];
    const addAProjectLink = routerLinks[0];

    expect(addAProjectLink.navigatedTo).toBeNull('Should not have navigated yet');

    addAProjectLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(addAProjectLink.navigatedTo).toBe('/add-a-project');
  });
});
