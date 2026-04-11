import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shell-footer',
  templateUrl: './shell-footer.component.html',
  styleUrl: './shell-footer.component.scss',
})
export class ShellFooterComponent {
  @Input({ required: true }) footer!: {
    brand: { title: string; subtitle: string };
    columns: { title: string; links: { label: string; href: string }[] }[];
    legal: string;
  };
}
