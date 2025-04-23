import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatCardTitle, MatCardContent, MatStepperModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatButtonModule],
  templateUrl: './waiting-list.component.html',
  styles: []
})
export class WaitingListComponent implements OnInit {
  square5: string = '';
  square10: string = '';
  square25: string = '';
  square50: string = '';
  square100: string = '';
  square500: string = '';
  square1000: string = '';
  liveStream: string = '';
  email: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}