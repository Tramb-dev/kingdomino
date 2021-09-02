import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayerInfoService } from '../services/player-info.service';

@Injectable({
  providedIn: 'root'
})
export class ToLobbyGuard implements CanActivate {
  private canAccess: boolean;
  constructor(playerInfo: PlayerInfoService) {
    this.canAccess = playerInfo.player.canAccessToLobby;
    }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.canAccess) {
        return true;
      } else {
        return false
      }
  }
  
}
