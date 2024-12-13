// guided-tour.service.ts
import { Injectable } from '@angular/core';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportGuidedToursService {
  private isTourActive = new BehaviorSubject<boolean>(false);

  bookshelfTour: GuidedTour = {
    tourId: 'bookshelf-tour',
    steps: [
      {
        selector: '#addBookButton',
        title: 'Start Your Collection',
        content: 'Click here to add a new book to your collection, kickstarting your personalized library.',
        orientation: Orientation.Bottom,
        highlightPadding: 5
      },
      {
        selector: '.bookshelf-content-body-container-body-row',
        title: 'Book List',
        content: 'Here are all your books listed. You can perform various actions like edit, delete, or view entries.',
        orientation: Orientation.Bottom,
        highlightPadding: 5
      },
      {
        selector: '#viewBookButton',
        title: 'Explore Book Details',
        content: "Click 'View' to see more details about each book, open it to add or read diary entries, or discover your superpowers based on its contents.",
        orientation: Orientation.Right,
        highlightPadding: 5
      },
      {
        selector: '#transferPagesButton',
        title: 'Transfer Pages',
        content: `Easily manage your book's content by transferring pages between books. Click "Transfer" to move pages to another book. You can choose to transfer all pages or select specific pages to transfer. This tool is especially useful for reorganizing or archiving content.`,
        orientation: Orientation.Right,
        highlightPadding: 5
      },
      {
        selector: '.bookshelf-content-body-container-body',
        title: 'Organize Your Books',
        content: `Rearrange your books by dragging and dropping them into your preferred order. This feature allows you to prioritize or group books by themes, dates, or any other criteria that suit your needs.`,
        orientation: Orientation.Bottom,
        highlightPadding: 5
      }

    ],
    skipCallback: function (stepSkippedOn) {
      console.log('Tour was skipped at step:', stepSkippedOn);
    },
    completeCallback: function () {
      console.log('Tour completed!');
    }
  };

  pageComponentTour: GuidedTour = {
    tourId: 'page-component-tour',
    steps: [
      {
        title: 'Welcome to Your Diary!',
        content: "This section contains the tools you need to manage your diary entries. From here, you can add new entries, select entries to view or edit, and navigate between them using the diary index. Let's explore how to use these tools to enhance your diary experience.",
        selector: '.page_header_container',
        orientation: Orientation.Center
      },
      {
        title: 'Select Your Diary Tab',
        content: 'Use this input field to select the diary tab you wish to view or edit. Enter the diary index number to quickly navigate to a specific entry. This field is editable only when previous entries are accessible, ensuring you can switch between them seamlessly.',
        selector: '#diaryTabSelection',
        orientation: Orientation.Bottom
      },
      {
        title: 'Add a New Diary Entry',
        content: "Click here to add a new page to your diary. Upon clicking, you'll choose from one of the diary types, tailoring the new entry to your preferred format. This button is disabled when you are in editing mode, ensuring that you complete or cancel the current modifications before adding new content.",
        selector: '#addNewDiary',
        orientation: Orientation.Right
      },
      // {
      //   title: 'Editing Status Indicator',
      //   content: "This area indicates whether you're currently in editing mode. When 'Editing mode activated' appears, it means you are actively modifying an entry. Any changes made here are saved automatically when you exit editing mode, ensuring your updates are preserved.",
      //   selector: '#editingMode',
      //   orientation: Orientation.Bottom
      // },
      {
        title: 'Save Your Diary Entry',
        content: 'Save the changes made to your current diary entry by clicking this button. It becomes active when you are not editing, allowing you to securely save your new entries or changes.',
        selector: '#saveDiaryEntry',
        orientation: Orientation.Bottom
      },
      {
        title: 'Finish Editing',
        content: "Click this button to finish your editing session. Exiting the editing mode automatically saves all the changes you've made. Use this to confirm and secure your updates without needing an extra save step.",
        selector: '#stopAndSaveEdits',
        orientation: Orientation.Bottom
      },
      {
        title: 'Edit Your Diary Entry',
        content: 'Use this button to start editing an existing diary entry. This option is only available when you are not already editing another entry, ensuring a focused editing experience.',
        selector: '#editDiaryEntry',
        orientation: Orientation.Bottom
      },
      {
        title: 'Delete a Diary Entry',
        content: 'If you need to remove an entry, use this button. Please be cautious, as deleting an entry is permanent and cannot be undone.',
        selector: '#deleteDiaryEntry',
        orientation: Orientation.Left
      },
      {
        title: 'Diary Entry Tabs',
        content: 'Each tab represents a different diary entry. Click on any tab to view that entry. The tab displays the entry number and the type of diary entry, helping you quickly identify and switch between them.',
        selector: '#tabLabel',
        orientation: Orientation.Top
      },
      {
        title: 'Emotion Tracking (Optional)',
        content: "You can choose to track your emotions for each diary entry. Simply enable the option by checking the 'Include Emotion' box. When enabled, select your current emotion and adjust the intensity using the slider. This feature helps you reflect on your feelings and can provide deeper insights over time. Remember, this is optional and can be toggled on or off depending on your preference for each entry.",
        selector: '#emotionCheckbox',
        orientation: Orientation.Bottom
      },
      {
        title: 'Emotion Tracking',
        content: 'This section allows you to record and rate your emotions for each diary entry. Select an emotion from the dropdown and adjust the intensity using the slider. This feature helps you track your emotional well-being over time.',
        selector: '.emotion-container',
        orientation: Orientation.Bottom
      },
      {
        title: 'Diary Entry Area',
        content: "This is where you can write your diary entries. The content area adapts based on the type of entry you are making—whether it's capturing dreams, reflecting on gratitude, or exploring emotions. Each diary type offers a tailored interface to best suit the nature of the entry. For instance, the 'Dream' diary includes fields for noting down symbols, distinct from the more text-based entries like 'Limitless' or 'Gratitude'. Note that the 'Dream' diary type includes special features for recording and analyzing dream symbols, offering a unique interface compared to other types.",
        selector: '.main_body',
        orientation: Orientation.Top
      },
      {
        title: 'Discover Your Superpowers',
        content: "As you fill your diary, keep the 'Discover Your Superpowers' feature in mind. Once you have at least 10 entries in this book, you can generate a report that reveals your core superpowers based on your writings. This feature is designed to provide you with valuable insights that can guide personal and professional development.",
        selector: '#discoverYourSuperpowers',
        orientation: Orientation.Bottom
      },
      {
        title: 'Ready to Begin?',
        content: "You're all set to start journaling! Choose a diary type and begin capturing your thoughts and experiences. Remember, each diary type is designed to complement the nature of your entries, providing you with the best possible tools for self-expression and reflection. Happy journaling!",
        selector: '',
        orientation: Orientation.Top
      },
    ],
    skipCallback: (stepSkippedOn: number) => {
      console.log('Tour skipped at step: ', stepSkippedOn);
    },
    completeCallback: () => {
      this.TourStatus$.subscribe((status) => {
        if (status) {
          this.completeTour();
        }
      });
      console.log('Tour completed!');
    }
  };

  constructor(private guidedTourService: GuidedTourService) { }

  public get TourStatus$(): Observable<boolean> {
    return this.isTourActive.asObservable();
  }

  startTour(tour: GuidedTour) {
    this.isTourActive.next(true);
    this.guidedTourService.startTour(tour);
  }

  completeTour() {
    this.isTourActive.next(false);
  }

  ngOnDestroy(): void {
    this.isTourActive.complete();
  }
}
