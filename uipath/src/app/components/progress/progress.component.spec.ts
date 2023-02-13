import { Component } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ProgressComponent } from './progress.component';
import { progressValueSelector } from './progresss.component.page-model';

@Component({
    template: `
      <t-progress [radius]="radius" [progress]="progress" [color]="color"></t-progress>
    `
})
class ProgressTestHostComponent {
  radius = 100;
  progress = 70;
  color = 'red';
}

describe('ProgressComponent', () => {
  let component: ProgressTestHostComponent;
  let fixture: ComponentFixture<ProgressTestHostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressComponent, ProgressTestHostComponent ],
      imports: [
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressTestHostComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    
  });

  it('should update the passed percentage after being started', fakeAsync(() => {
    const expectedCompletedPercentage = 85; // Initial progress is 70 -> After 15 intervals the final progress should be 85

    // Mock the passage of time using the "tick" function to simulate that 15 intervals have passed -> this is currently hardcoded based on the progress "speed" configuration
    fixture.detectChanges();
    tick(50 * 15);
    fixture.detectChanges();
    
    const progressValue = nativeElement.querySelector(progressValueSelector)?.textContent;
    expect(progressValue).toEqual(`${expectedCompletedPercentage}%`);

    discardPeriodicTasks();
  }));
});
