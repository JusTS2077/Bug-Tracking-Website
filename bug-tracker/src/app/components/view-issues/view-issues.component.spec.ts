import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIssuesComponent } from './view-issues.component';

describe('ViewIssuesComponent', () => {
  let component: ViewIssuesComponent;
  let fixture: ComponentFixture<ViewIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewIssuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
