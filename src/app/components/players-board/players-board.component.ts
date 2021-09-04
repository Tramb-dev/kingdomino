import { Component, OnInit } from '@angular/core';
import { PlayerInfoService } from 'src/app/services/player-info.service';

@Component({
  selector: 'app-players-board',
  templateUrl: './players-board.component.html',
  styleUrls: ['./players-board.component.scss']
})
export class PlayersBoardComponent implements OnInit {

  constructor(public playerInfo: PlayerInfoService) { }

  ngOnInit(): void {
  }

}
