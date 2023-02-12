import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DEFAULT_GRID_PAGE_NUMBER, DEFAULT_GRID_PAGE_SIZE, GRID_PAGINATION_OPTIONS } from './constants/grid.constants';
import { GridEntryDirective } from './directives/grid-entry/grid-entry.directive';
import { SortChange } from './types/grid-types';

@Component({
  selector: 't-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements AfterContentInit, OnInit, OnDestroy {
  @Input() data: Observable<any[]> = new Observable<any[]>();
  @Input() pageSize: number | null = null;

  @Output() sortChange = new EventEmitter<SortChange>();
  @Output() pageNumberChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  gridData: any[] = []
  displayedData: any[] = [];

  // Pagination
  totalPageCount: number = DEFAULT_GRID_PAGE_NUMBER;
  currentPage: number = DEFAULT_GRID_PAGE_NUMBER;
  pageSizeOptions = GRID_PAGINATION_OPTIONS;
  paginationForm = this.formBuilder.group({
    pageSize: [DEFAULT_GRID_PAGE_SIZE]
  });

  // Children config to get table headers via directives
  @ContentChildren(GridEntryDirective) gridHeaders!: QueryList<GridEntryDirective>;

  gridHeaderConfig: GridEntryDirective[] = [];

  private subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {}

  ngAfterContentInit(): void {
    this.gridHeaderConfig = this.gridHeaders.toArray();
  }

  ngOnInit(): void {
    if (this.data instanceof Observable) {
      const sub = this.data.subscribe((items: any[]) => {
        this.setGridData(items);
      });
      this.subscription.add(sub);
    } else {
      // TODO: Handle data when not an observable
    }

    this.initializePageSize();
  }

  private initializePageSize() {
    const formSub = this.paginationForm.valueChanges.subscribe(value => {
      this.computeDisplayedData(true);
      // Page size should always be non-null when the value changes since the select contains a list of possible values.
      this.pageSizeChange.emit(Number(value.pageSize));
    });
    this.subscription.add(formSub);

    if (!!this.pageSize) {
      this.paginationForm.get('pageSize')?.setValue(this.pageSize);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setGridData(gridData: any[]) {
    this.gridData = gridData;
    if (this.pageSize) {
      this.computeDisplayedData();
    }
  }

  // Dev note: Potentially, this can be located into a "grid-paging.service" for the logic
  private computeDisplayedData(moveToFirstPage: boolean = false) {
    const itemsCount = this.gridData.length;
    const pageSize = Number(this.paginationForm.get('pageSize')?.getRawValue()) || DEFAULT_GRID_PAGE_SIZE;
    this.totalPageCount = Math.ceil(itemsCount / pageSize);

    this.updateDisplayedData(pageSize, moveToFirstPage);
  }

  private updateDisplayedData(pageSize: number, moveToFirstPage: boolean = false) {
    if (moveToFirstPage) {
      this.currentPage = DEFAULT_GRID_PAGE_NUMBER;
    }
    const startIndex = (this.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    this.displayedData = this.gridData.slice(startIndex, endIndex);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    if (this.pageSize) {
      this.computeDisplayedData();
      this.pageNumberChange.emit(pageNumber);
    }
  }
}
