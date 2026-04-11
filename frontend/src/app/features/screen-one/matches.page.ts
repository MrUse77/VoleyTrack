import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ScreenOneFooterComponent } from './components/screen-one-footer.component';
import { ScreenOneMatchesComponent } from './components/screen-one-matches.component';
import { ScreenOneTopbarComponent } from './components/screen-one-topbar.component';
import { SCREEN_ONE_MATCHES_VM } from './screen-one.models';

const ICONS = [
  [
    'vt-brand',
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3 5 8l2 10 5 3 5-3 2-10-7-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 9h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9 13h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  ],
  [
    'vt-search',
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m20 20-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2"/></svg>',
  ],
  [
    'vt-notifications',
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  ],
  [
    'vt-live',
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>',
  ],
  [
    'vt-avatar',
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  ],
] as const;

@Component({
  selector: 'app-matches-page',
  imports: [ScreenOneTopbarComponent, ScreenOneMatchesComponent, ScreenOneFooterComponent],
  templateUrl: './matches.page.html',
  styleUrl: './matches.page.scss',
})
export class MatchesPage {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  readonly vm = SCREEN_ONE_MATCHES_VM;

  constructor() {
    for (const [name, svg] of ICONS) {
      this.iconRegistry.addSvgIconLiteral(name, this.sanitizer.bypassSecurityTrustHtml(svg));
    }
  }
}
