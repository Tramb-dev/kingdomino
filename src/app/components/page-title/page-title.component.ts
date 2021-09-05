import { Component, OnInit } from '@angular/core';

import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent implements OnInit {
  messageToDisplay: string = '';

  constructor(public logsService: LogsService) {}

  ngOnInit(): void {
    this.messageToDisplay = this.logsService.messageToDisplay;
  }
}
