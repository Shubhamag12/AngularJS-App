import { Component, OnInit, ViewChild } from '@angular/core';
import { Feedback, ContactType } from '../shared/feedback';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { flyInOut, expand, visibility } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  host: {
    '[@flyInOut]' : 'true',
    'style' : 'display: block;'
  },
  animations: [
    flyInOut(),
    expand(),
    visibility()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackcopy: Feedback;
  contactType = ContactType;
  errMess: string;

  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be atleast 2 characters long',
      'maxlength': 'First name cannot be more than 25 characters long'
    },
    'lastname': {
      'required': 'Last name is required',
      'minlength': 'Last name must be atleast 2 characters long',
      'maxlength': 'Last name cannot be more than 25 characters long'
    },
    'telnum': {
      'required': 'Phone number is required',
      'pattern': 'Phone number must contain only numbers'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email not in valid format.'
    }
  };

  isLoading: boolean;
  isShowingResponse: boolean;

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) { 
    this.createForm();
    this.isLoading = false;
    this.isShowingResponse = false;
  }

  ngOnInit(): void {
  }

  createForm(): void{
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype:'None',
      message: ''
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
 
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if(!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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

  onSubmit(){
    this.isLoading = true;
    this.feedback = this.feedbackForm.value;
    this.feedbackService.submitFeedback(this.feedback)
      .subscribe(feedback => {
        this.feedback = feedback;
        console.log(this.feedback);
      },
      errmess => {
        this.feedback = null;
        this.feedbackcopy = null;
        this.errMess = <any>errmess;
      },
      () => {
        this.isShowingResponse = true;
        setTimeout(() => {
          this.isShowingResponse = false;
          this.isLoading = false;
        } , 5000);
      });  
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contactType: 'None',
      message: ''
    });


  }
}  
