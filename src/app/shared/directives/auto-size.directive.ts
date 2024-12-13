import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'textarea[appAutosize], input[appAutosize]',
  standalone: true,
})
export class AutosizeDirective {
  @Input() fontSize: string | null = null;
  @Input() fontColor: string | null = null;
  @Input() fontFamily: string | null = null;
  @Input() borderColor: string | null = null;

  constructor(private elementRef: ElementRef) {
    this.elementRef.nativeElement.style.overflow = 'hidden';
  }

  ngOnChanges(): void {
    this.updateStyles();
  }

  ngOnInit(): void {
    this.adjust();
  }

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
  }

  updateStyles(): void {
    const textArea = this.elementRef.nativeElement;
    if (this.fontSize) {
      textArea.style.fontSize = this.fontSize;
    }
    if (this.fontColor) {
      textArea.style.color = this.fontColor;
    }
    if (this.fontFamily) {
      textArea.style.fontFamily = this.fontFamily;
    }
    // if (this.borderColor) {
    //   textArea.style.border = `1px solid ${this.borderColor}`;
    // }
  }

  private adjust(): void {
    const textarea = this.elementRef.nativeElement as HTMLTextAreaElement;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
