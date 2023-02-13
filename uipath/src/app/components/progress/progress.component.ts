import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  PROGRESS_DEFAULT_COLOR,
  PROGRESS_MAX_PROGRESS,
  PROGRESS_MIN_PROGRESS,
  PROGRESS_MIN_RADIUS,
} from './constants/progress.constants';
import { getCircleDiameterFromRadius, getCircleStrokeFromRadius } from './util/circle-utils';

@Component({
  selector: 't-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  animations: [
    trigger('progressFill', [
      state('true', style({
        background: 'conic-gradient({{color}} {{currentProgress}}deg, white 0deg 360deg)',
        rotate: '{{currentProgress}}deg'        
      }), { params: { currentProgress: 0, color: 'red', currentAngle: 0 }}),
      state('false', style({
        background: 'conic-gradient({{color}} {{currentProgress}}deg, white {{currentProgress}}deg 360deg)',
        rotate: '{{currentProgress}}deg'
      }), { params: { currentProgress: 0, color: 'red', currentAngle: 0 }}),
      transition('true => false', animate('{{animationDuration}}ms linear'), { params: { animationDuration: 0 }}),
      transition('false => true', animate('{{animationDuration}}ms linear'), { params: { animationDuration: 0 }}),
    ])
  ]
})
export class ProgressComponent implements OnInit, AfterViewInit {
  @Input() radius: number = PROGRESS_MIN_RADIUS;
  @Input() progress: number = PROGRESS_MIN_PROGRESS;
  @Input() color: string = PROGRESS_DEFAULT_COLOR;

  @Output() complete = new EventEmitter();

  // Default diameter and stroke
  circularProgressDiameter = getCircleDiameterFromRadius(PROGRESS_MIN_RADIUS);
  progressStroke = getCircleStrokeFromRadius(PROGRESS_MIN_RADIUS);

  currentProgress = 0;
  progressFillState = true;
  speed = 50;

  ngOnInit() {
    this.initializeProgressBounds();
    this.currentProgress = this.getStartProgressValue(this.progress);
  }

  initializeProgressBounds() {
    if (this.radius) {
      this.circularProgressDiameter = getCircleDiameterFromRadius(this.radius);
      this.progressStroke = getCircleStrokeFromRadius(this.radius);
    }
  }

  ngAfterViewInit(): void {
    this.initializeProgressAnimation();
  }

  private initializeProgressAnimation() {
    
    const endValue = PROGRESS_MAX_PROGRESS;
    
    let progressInterval = setInterval(() => {
      if (this.currentProgress === endValue) {
        this.complete.emit();
        clearInterval(progressInterval);
      } else {
        this.currentProgress++;
        // Toggle between the animation states to update the gradient and the progress rotation
        this.progressFillState = !this.progressFillState;
      }
    }, this.speed);
  }

  private getStartProgressValue(configuredValue: number) {
    return configuredValue >= PROGRESS_MAX_PROGRESS ? PROGRESS_MAX_PROGRESS : configuredValue;
  }
}
