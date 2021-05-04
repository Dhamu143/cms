import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameUsersComponent } from './game-users.component';

describe('GameUsersComponent', () => {
  let component: GameUsersComponent;
  let fixture: ComponentFixture<GameUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
