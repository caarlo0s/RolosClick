import { Component,OnInit,AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { RestaurantService } from 'src/app/core/services/restaurant.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewChecked{
  isCollapsed = false;
  subs= new Subscription();
constructor(private authS:AuthService,private restS:RestaurantService, private router:Router){}
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

 async ngAfterViewChecked() {

  this.subs.add(
    this.authS.authUser$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/dashboard'])
      }
      else{
        this.router.navigate(['/login']);
      }

    })
  );
  }
}
