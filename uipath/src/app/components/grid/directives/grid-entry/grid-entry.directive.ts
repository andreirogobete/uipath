import { Directive, Input } from '@angular/core';

@Directive({
  selector: 't-entry'
})
export class GridEntryDirective {
  @Input() title: string = '';
  @Input() property: string = '';
  @Input('boolean-attribute') sortable: boolean = false;
}
