import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subscription, switchMap } from 'rxjs';
import { SortConfigDirection } from './components/grid/types/grid-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'UIPath Home Assignment';
  data: any = null;

  private subscription = new Subscription();

  constructor(private http: HttpClient) {
    // const sub = this.http.get('../assets/data/users.json').subscribe((userData: any) => {
    //   this.data = userData.users;
    // });

    this.data = this.http.get('../assets/data/users.json').pipe(
      map((response: any) => {
        return response.users;
      })
    );

    // this.subscription.add(sub);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Grid Events -> Console log only
  handleSortChange(event: any) {
    const { column, direction } = event;
    const directionString = direction === SortConfigDirection.ASC ? 'ASC' : 'DESC';
    console.log(`Grid sort chaged for column ${column} with direction ${directionString}.`);
  }

  handlePageSizeChange(event: any) {
    console.log(`Grid page size has changed to ${event} items per page.`);
  }

  handlePageNumberChange(event: any) {
    console.log(`Grid page number has changed to page number ${event}.`)
  }
}
