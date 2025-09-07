import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    CardModule, InputTextModule, TextareaModule, FormsModule,
    ButtonModule, ToastModule, Navbar, Footer
  ],
  providers: [MessageService],
  templateUrl: './contact.html'
})
export class Contact implements OnInit {
  form!: FormGroup;
  sending = false;

  constructor(private fb: FormBuilder, private messageService: MessageService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Please fill all fields' });
      return;
    }

    this.sending = true;
    setTimeout(() => {
      console.log('Form sent:', this.form.value);
      this.messageService.add({ severity: 'success', summary: 'Sent!', detail: 'Your message has been sent' });
      this.form.reset();
      this.sending = false;
    }, 1500);
  }
}
