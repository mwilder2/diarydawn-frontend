import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appHighlightSelected]',
  standalone: true,
})
export class HighlightSelectedDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @Input() set appHighlightSelected(isSelected: boolean) {
    if (isSelected) {
      this.renderer.addClass(this.el.nativeElement, 'selected');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'selected');
    }
  }
}
