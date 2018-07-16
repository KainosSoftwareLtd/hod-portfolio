import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RouterLinkDirectiveStub } from '../router-link-directive-stub.directive';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let el;

  let linkDebugElements;
  let routerLinks;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterLinkDirectiveStub, HeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;

    // find DebugElements with an attached RouterLinkStubDirective
    linkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances using each DebugElement's injector
    routerLinks = linkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('renders app title', () => {
    expect(el.querySelector('header h1').textContent).toContain('Project Dashboard');
  });

  it('has got home link', () => {
    expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
    expect(routerLinks[0].linkParams).toBe('/overview');
  });

  it('navigates to landing page on home click', () => {
    const homeLinkDebugElement = linkDebugElements[0];
    const homeLink = routerLinks[0];

    expect(homeLink.navigatedTo).toBeNull('Should not have navigated yet');

    homeLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(homeLink.navigatedTo).toBe('/overview');
  });
});
