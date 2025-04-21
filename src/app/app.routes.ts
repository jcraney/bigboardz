import { Routes } from '@angular/router';
import { BoardListComponent } from './board-list/board-list.component';
import { WaitingListComponent } from './waiting-list/waiting-list.component';

export const routes: Routes = [
  { path: 'boardz', component: BoardListComponent },
  { path: 'waiting-list', component: WaitingListComponent}
];
