import { Component, Input, OnInit } from '@angular/core';
import { SquaresService } from '../squares.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.css']
})
export class BoardDetailsComponent implements OnInit {
  board: any; // Replace 'any' with your board interface
  boardId: string | null = null;

  constructor(
    private squaresService: SquaresService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.boardId = params.get('id');
      if (this.boardId) {
        this.loadBoardDetails(this.boardId);
      }
    });
  }

  loadBoardDetails(boardId: string): void {
    this.squaresService.getBoard(boardId).subscribe(board => this.board = board);
  }

  purchaseSquare(squareId: number) {
    this.squaresService.purchaseSquare(this.boardId!, squareId).subscribe(() => console.log(`Purchased square ${squareId} on board ${this.boardId}`));
  }
}