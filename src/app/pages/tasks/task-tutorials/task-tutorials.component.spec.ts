import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskTutorialsComponent } from './task-tutorials.component';

describe('TaskTutorialsComponent', () => {
  let component: TaskTutorialsComponent;
  let fixture: ComponentFixture<TaskTutorialsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTutorialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
