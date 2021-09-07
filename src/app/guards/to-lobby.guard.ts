import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PlayerInfoService } from '../services/player-info.service';

@Injectable({
  providedIn: 'root',
})
export class ToLobbyGuard implements CanActivate {
  private canAccess: boolean;
  constructor(playerInfo: PlayerInfoService, private router: Router) {
    this.canAccess = playerInfo.player.canAccessToLobby
      ? playerInfo.player.canAccessToLobby
      : false;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.canAccess) {
      return true;
    } else {
      return this.router.navigate(['/', 'home']);
    }
  }
}
