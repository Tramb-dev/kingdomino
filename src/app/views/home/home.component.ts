import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerInfoService } from 'src/app/services/player-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  modalOpened: boolean = false;

  constructor(private router: Router, private playerInfo: PlayerInfoService) { }

  openDialog(): void {
    this.modalOpened = true;
  }

  closeDialog(): void {
    this.modalOpened = false;
  }

  goToLobby(pseudo: string): void {
    this.closeDialog();
    this.playerInfo.newPlayer(pseudo).subscribe();
    this.playerInfo.player.canAccessToLobby = true;
    this.router.navigate(['/', 'lobby']);
  }
}