import { Component } from '@angular/core';
import { ScreenOneMatchCenterComponent } from './components/screen-one-match-center.component';
import { SCREEN_ONE_MATCHES_VM } from './screen-one.models';
import { ShellFooterComponent } from '../../shell/components/shell-footer.component';

@Component({
  selector: 'app-matches-page',
  imports: [ScreenOneMatchCenterComponent, ShellFooterComponent],
  templateUrl: './matches.page.html',
  styleUrl: './matches.page.scss',
})
export class MatchesPage {
  readonly vm = SCREEN_ONE_MATCHES_VM;
}
