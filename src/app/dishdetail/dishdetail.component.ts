import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; 
import { DishService } from '../services/dish.service'; 
import { switchMap, scan } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';  
import { visibility, flyInOut, expand } from '../animations/app.animation'; 

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host: {
    '[@flyInOut]' : 'true',
    'style' : 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;   
  dish : Dish;
  dishIds: string[];
  prev: string
  next: string;


  commentForm : FormGroup;
  comment : Comment;
  dishcopy: Dish;
  errMess: string;

  visibility = 'shown';

  formErrors = {
    'author' : '',
    'comment' : '',
  };

  validationMessages = {
    'author' : {
      'required' : 'Name is required',
      'minlength' : 'Name must be at least 2 characters long',
      'maxlength' : 'Name must not be more than 25 characters long',
    },
    'comment' : {
      'required' : 'Comment is required',
      'minlength' : 'Comment must be at least 1 characters long',
    }  
  }

  constructor(private dishService: DishService, 
    private location: Location,
    private route: ActivatedRoute,
    private fb : FormBuilder,
    @Inject('BaseURL') private BaseURL) { }
  

  ngOnInit(): void {
    this.createForm();
    
    this.dishService.getDishIds()
     .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
     .pipe(switchMap((params: Params) => {this.visibility = 'hidden' ; return this.dishService.getDish(params['id']); }))
     .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown';},
      errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group ({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(1)] ]
    });

    this.commentForm.valueChanges
     .subscribe(data => this.onValueChanged(data));

     this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if(!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) { 
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if(control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }  

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
     .subscribe(dish => {
       this.dish = dish;
       this.dishcopy = dish;
     },
    errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess});
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
  }
}
