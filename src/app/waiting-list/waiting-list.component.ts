import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule for form handling

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule to imports
  template: `
    <p>waiting-list works!</p>
  `,
  styles: []
})
export class WaitingListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}