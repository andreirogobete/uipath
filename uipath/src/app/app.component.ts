import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subscription, switchMap } from 'rxjs';

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
}
