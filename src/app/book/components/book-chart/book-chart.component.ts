import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Page } from '../../../page/models/page.models';
import { DiaryTypeCountPipe } from '../../../page/pipes/entry-type-count.pipe';
import { PageSelectors, PageState } from '../../../page';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.models';
import { HttpClientModule } from '@angular/common/http';

Chart.register(...registerables);

@Component({
  selector: 'app-book-chart',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
  ],
  templateUrl: './book-chart.component.html',
  styleUrls: ['./book-chart.component.scss'],
})
export class BookChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas: ElementRef | undefined;
  chart: Chart | undefined;
  pages$: Observable<Page[]> | undefined;
  isLoaded = true;
  chartData: number[] = [];
  processingLabels = [
    'limitless',
    'journey',
    'emotion',
    'gratitude',
    'lesson',
    'dream',
    'affirmation',
  ];
  private pagesSubscription: Subscription | undefined;
  private destroy$ = new Subject<void>();

  constructor(private pageStore: Store<PageState>) {
  }

  private _book: Book | undefined;

  get book(): Book | undefined {
    return this._book;
  }

  @Input()
  set book(value: Book | undefined) {
    this._book = value;
    if (this._book) {
      this.pages$ = this.pageStore.select(
        PageSelectors.selectFilterPagesByBookId(this._book.id!)
      );
      this.computeChartData();
    }
  }

  ngOnInit(): void {
    this.computeChartData();
  }

  ngAfterViewInit(): void {
    this.updateChart(); // Call updateChart() after the view is fully initialized
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book']) {
      this.computeChartData();
    }
  }

  computeChartData(): void {
    if (this.book) {
      const diaryTypeCountPipe = new DiaryTypeCountPipe();
      this.pagesSubscription = this.pages$!.pipe(takeUntil(this.destroy$)).subscribe((pages) => {
        this.chartData = this.processingLabels.map((label) => {
          const count = diaryTypeCountPipe.transform(pages, label);
          const totalPages = pages.length;
          const percentage = totalPages > 0 ? (count / totalPages) * 100 : 0;
          return Math.round(percentage);
        });
        this.updateChart();
      });
    }
  }

  // Function to get CSS variable values
  getCssVariableColor(varName: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }


  updateChart() {
    if (!this.chartCanvas || !this.chartData) {
      return; // Exit early if this.chartCanvas or this.data is not available
    }
    // Destroy the existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    const labels = [
      'Limitless',
      'Journey',
      'Emotion',
      'Gratitude',
      'Lesson',
      'Dream',
      'Affirmation',
    ];
    const data = this.chartData;

    // Use this function to set up your chart data
    this.chart = new Chart(this.chartCanvas!.nativeElement, {
      type: 'bar',
      data: {
        labels, // your labels array
        datasets: [
          {
            data, // your data array
            backgroundColor: [
              this.getCssVariableColor('--limitless-diary-light'),
              this.getCssVariableColor('--journey-diary-light'),
              this.getCssVariableColor('--gratitude-diary-light'),
              this.getCssVariableColor('--emotion-diary-light'),
              this.getCssVariableColor('--lesson-diary-light'),
              this.getCssVariableColor('--dream-diary-light'),
              this.getCssVariableColor('--affirmation-diary-light'),
            ],
            borderColor: [
              this.getCssVariableColor('--limitless-diary'),
              this.getCssVariableColor('--journey-diary'),
              this.getCssVariableColor('--gratitude-diary'),
              this.getCssVariableColor('--emotion-diary'),
              this.getCssVariableColor('--lesson-diary'),
              this.getCssVariableColor('--dream-diary'),
              this.getCssVariableColor('--affirmation-diary'),
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.parsed.y;
                return `${label}: ${value}%`;
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.pagesSubscription) {
      this.pagesSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
