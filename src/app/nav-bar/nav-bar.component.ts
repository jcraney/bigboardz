import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BoardListComponent } from '../board-list/board-list.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BoardListComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" routerLink="/">Football Squares</a>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" routerLink="/boards" routerLinkActive="active">Boards</a>
          </li>
          <!-- Add other navigation links here -->
        </ul>
      </div>
    </nav>
  `,
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent { }