import { Component } from '@angular/core';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-game-logs',
  templateUrl: './game-logs.component.html',
  styleUrls: ['./game-logs.component.scss'],
})
export class GameLogsComponent {
  constructor(public logsService: LogsService) {}
}
