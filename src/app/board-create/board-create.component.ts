import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SquaresService } from '../squares.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board-create',
  templateUrl: './board-create.component.html',
  styleUrls: ['./board-create.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class BoardCreateComponent implements OnInit {
  ngOnInit(): void {
    
  }
  constructor(private squaresService: SquaresService) {}

  entryFee: number = 0;
  payoutStructure: string = '';
  acceptedToken: string = '';
  gameDetails: string = '';

  createBoard() {
    console.log('Creating board with:', {
      entryFee: this.entryFee,
      payoutStructure: this.payoutStructure,
      acceptedToken: this.acceptedToken,
      gameDetails: this.gameDetails,
    });
    this.squaresService.createBoard({
      entryFee: this.entryFee,
      payoutStructure: this.payoutStructure,
      acceptedToken: this.acceptedToken,
      gameDetails: this.gameDetails,
    });
  }
}