import { Directive, OnChanges, Input, HostBinding, ElementRef, SimpleChanges } from "@angular/core";
import { MatTooltip } from "@angular/material/tooltip";

@Directive({
  selector: '[appDisabledTooltip]',
  standalone: true,
})
export class DisabledTooltipDirective implements OnChanges {

  @Input() appDisabledTooltip: boolean = false;
  @HostBinding('attr.disabled') get disabled() { return this.appDisabledTooltip ? 'disabled' : null; }
  @HostBinding('style.opacity') get opacity() { return this.appDisabledTooltip ? '0.5' : '1'; }
  @HostBinding('style.cursor') get cursor() { return this.appDisabledTooltip ? 'not-allowed' : 'pointer'; }

  constructor(
    private el: ElementRef,
    private tooltip: MatTooltip
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appDisabledTooltip']) {
      if (this.appDisabledTooltip) {
        this.tooltip.disabled = false;
        this.tooltip.message = 'You must have at least 2 pages in a book and at least 1 other book to transfer pages';
      } else {
        this.tooltip.disabled = true;
        this.tooltip.message = '';
      }
    }
  }
}

