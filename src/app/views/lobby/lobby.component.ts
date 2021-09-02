import { Component, OnInit } from '@angular/core';
import { PlayerInfoService } from 'src/app/services/player-info.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(private playerInfo: PlayerInfoService) { }

  ngOnInit(): void {
  }

}
