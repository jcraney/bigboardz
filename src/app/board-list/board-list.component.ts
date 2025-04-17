import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SquaresService } from '../squares.service';
import { Board } from '../board.model';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];

  constructor(private squaresService: SquaresService, private router: Router) { }

  ngOnInit(): void {
    this.getBoards();
  }

  getBoards(): void {
    this.squaresService.getBoards().subscribe(boards => this.boards = boards);
  }

  viewBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }
}
