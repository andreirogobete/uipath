import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {
  DEFAULT_GRID_PAGE_NUMBER,
  DEFAULT_GRID_PAGE_SIZE,
  DEFAULT_GRID_PAGINATION_OPTIONS,
} from './constants/grid.constants';
import { GridEntryDirective } from './directives/grid-entry/grid-entry.directive';
import { SortConfig, SortConfigDirection } from './types/grid-types';
import { sortData } from './util/data-sorting.helper';

@Component({
  selector: 't-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Observable<any[]> = new Observable<any[]>();
  @Input() pageSize: number | null = null;

  @Output() sortChange = new EventEmitter<SortConfig>();
  @Output() pageNumberChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  gridData: any[] = [];
  displayedData: any[] = [];

  // Pagination Form
  totalPageCount: number = DEFAULT_GRID_PAGE_NUMBER;
  currentPage: number = DEFAULT_GRID_PAGE_NUMBER;
  pageSizeOptions = DEFAULT_GRID_PAGINATION_OPTIONS;
  paginationForm = this.formBuilder.group({
    pageSize: [DEFAULT_GRID_PAGE_SIZE],
  });

  // Sorting
  sortConfig: SortConfig | null = null;

  // Define enum as readonly in order to be used in template
  readonly sortConfigDirection = SortConfigDirection;

  // Children config to get table headers via directives
  @ContentChildren(GridEntryDirective) gridHeaders!: QueryList<GridEntryDirective>;

  private subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.data instanceof Observable) {
      const sub = this.data.subscribe((items: any[]) => {
        this.setGridData(items);
        this.initializePageSize();
      });
      this.subscription.add(sub);
    } else {
      // TODO: Handle data when not an observable
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle the case in which data comes as non observable
    const data = changes['data'].currentValue;
    if (data instanceof Observable) {
      // Observable is handled in the ngOnInit method
      return;
    }
    if (!this.gridData.length && !!data?.length) {
      this.setGridData(data);
    }
  }

  private initializePageSize() {
    const formSub = this.paginationForm.valueChanges.subscribe((value) => {
      this.computeDisplayedData(true);
      // Page size should always be non-null when the value changes since the select contains a list of possible values.
      if (this.pageSize !== value.pageSize) {
        this.pageSizeChange.emit(Number(value.pageSize));
      }
    });
    this.subscription.add(formSub);

    if (!this.pageSize) {
      // Set the page size to the number of data.count
      this.pageSize = this.gridData.length;
    }

    this.paginationForm.get('pageSize')?.setValue(this.pageSize);
    this.setPageSizeOptions();
  }

  private setPageSizeOptions() {
    let pagingOptions: number[] = [];
    if (this.pageSize) {
      if (!DEFAULT_GRID_PAGINATION_OPTIONS.includes(this.pageSize)) {
        pagingOptions = [...DEFAULT_GRID_PAGINATION_OPTIONS, this.pageSize];
      }
    } else {
      pagingOptions = [
        ...DEFAULT_GRID_PAGINATION_OPTIONS,
        this.gridData.length,
      ];
    }

    pagingOptions.sort((left: number, right: number) => left - right);
    this.pageSizeOptions = pagingOptions;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setGridData(gridData: any[]) {
    this.gridData = gridData;
    this.computeDisplayedData();
  }

  // Dev note: Potentially, this can be located into a "grid-paging.service" for the logic
  private computeDisplayedData(moveToFirstPage: boolean = false) {
    const itemsCount = this.gridData.length;
    const pageSize =
      Number(this.paginationForm.get('pageSize')?.getRawValue()) ||
      DEFAULT_GRID_PAGE_SIZE;
    this.totalPageCount = Math.ceil(itemsCount / pageSize);

    this.updateDisplayedData(pageSize, moveToFirstPage);
  }

  private updateDisplayedData(
    pageSize: number,
    moveToFirstPage: boolean = false
  ) {
    if (moveToFirstPage) {
      this.currentPage = DEFAULT_GRID_PAGE_NUMBER;
    }
    const startIndex = (this.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    this.displayedData = this.gridData.slice(startIndex, endIndex);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.computeDisplayedData();
    this.pageNumberChange.emit(pageNumber);
  }

  handleSort(propertyName: string) {
    // If sorting is not enabled for the column, do nothing
    if (
      !this.gridHeaders.find((entry) => entry.property === propertyName)?.sortable
    ) {
      return;
    }
    const sortColumn = this.sortConfig?.column;
    const sortDirection = this.sortConfig?.direction;

    // If the current sorted column is the same as the property name, we just need to change the direction
    if (sortColumn === propertyName) {
      if (sortDirection === SortConfigDirection.ASC) {
        this.sortDisplayedData(propertyName, SortConfigDirection.DESC);
      } else {
        this.sortDisplayedData(propertyName, SortConfigDirection.ASC);
      }
    } else {
      this.sortDisplayedData(propertyName, SortConfigDirection.ASC); // Default sort is always ASC
    }
  }

  private sortDisplayedData(
    propertyName: string,
    sortDirection: SortConfigDirection
  ) {
    const sortedData = sortData(this.gridData, propertyName, sortDirection);
    this.gridData = sortedData;
    const pageSize = Number(this.paginationForm.get('pageSize')?.value);
    this.updateDisplayedData(pageSize);

    this.sortConfig = {
      column: propertyName,
      direction: sortDirection,
    };

    this.sortChange.emit(this.sortConfig);
  }
}
