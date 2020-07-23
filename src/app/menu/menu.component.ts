import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut , expand } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  host: {
    '[@flyInOut]' : 'true',
    'style' : 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  errMess: string;

  constructor(private dishService: DishService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit(): void {
    this.dishService.getDishes()
     .subscribe((dishes) => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }
  
}
