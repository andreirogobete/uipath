import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { SortChange } from '../../types/grid-types';

@Directive({
  selector: 't-entry'
})
export class GridEntryDirective {
  @Input() title: string = '';
  @Input() property: string = '';
  @Input('boolean-attribute') sortable: boolean = false;
}
