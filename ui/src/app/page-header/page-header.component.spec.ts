import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RouterLinkDirectiveStub } from '../router-link-directive-stub.directive';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  let linkDebugElements;
  let routerLinks;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterLinkDirectiveStub, PageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // find DebugElements with an attached RouterLinkStubDirective
    linkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances using each DebugElement's injector
    routerLinks = linkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('has home link', () => {
    expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
    expect(routerLinks[0].linkParams).toBe('/overview');
  });

  it('navigates to overview on home click', () => {
    const homeLinkDebugElement = linkDebugElements[0];
    const homeLink = routerLinks[0];

    expect(homeLink.navigatedTo).toBeNull('Should not have navigated yet');

    homeLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(homeLink.navigatedTo).toBe('/overview');
  });
});
