import { Component } from '@angular/core';
import {
  faLinkedin,
  faGithub,
  faAngular,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'kingdomino';
  faLinkedin = faLinkedin;
  faGithub = faGithub;
  faAngular = faAngular;
}
