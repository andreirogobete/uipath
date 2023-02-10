import { AfterContentInit, AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GridEntryComponent } from './components/grid-entry/grid-entry.component';
import { SortChange } from './types/grid-types';

@Component({
  selector: 't-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements AfterContentInit, OnInit, OnChanges, OnDestroy {
  @Input() data: Observable<any[]> = new Observable<any[]>();
  @Input() pageSize: number | null = null;

  @Output() sortChange = new EventEmitter<SortChange>();
  @Output() pageNumberChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  gridData: any[] = []
  displayedData: any[] = [];

  // Used for pagination
  skip: number = 0;
  pageCount: number = 1;
  currentPage = this.pageCount;

  // Children config to get table headers
  @ContentChildren(GridEntryComponent) gridEntries!: QueryList<GridEntryComponent>;

  gridEntriesConfig: GridEntryComponent[] = [];

  private subscription = new Subscription();

  ngAfterContentInit(): void {
    this.gridEntriesConfig = this.gridEntries.toArray();
  }

  ngOnInit(): void {
    if (this.data instanceof Observable) {
      const sub = this.data.subscribe((items: any[]) => {
        this.setGridData(items);
      })
    } else {
      console.log('NU')
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    
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

  private computeDisplayedData() {
    const pageSize = this.pageSize!;
    const dataCount = this.gridData.length;
    this.pageCount = Math.ceil(dataCount / pageSize);
    const startIndex = (this.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    console.log(startIndex, endIndex, this.currentPage)

    this.displayedData = this.gridData.slice(startIndex, endIndex);
  }

  handlePageChange(pageNumber: number) {
    console.log(pageNumber);
    this.currentPage = pageNumber;
    if (this.pageSize) {
      this.computeDisplayedData();
    }
  }
}
