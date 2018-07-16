import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAProjectComponent } from './add-a-project.component';

describe('AddAProjectComponent', () => {
  let component: AddAProjectComponent;
  let fixture: ComponentFixture<AddAProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
