import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortChange } from '../../types/grid-types';

@Component({
  selector: 't-entry',
  templateUrl: './grid-entry.component.html',
  styleUrls: ['./grid-entry.component.scss']
})
export class GridEntryComponent {
  @Input() title: string = '';
  @Input() property: string = '';
  @Input('boolean-attribute') sortable: boolean = false;

  @Output() sortChange = new EventEmitter<SortChange>();
}
