import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { ChatgptInterfaceComponent } from '../chatgpt-interface/chatgpt-interface.component';

@Component({
  selector: 'try-chatgpt',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    ChatgptInterfaceComponent
  ],
  templateUrl: './try-chatgpt.component.html',
  styleUrl: './try-chatgpt.component.scss'
})
export class TryChatgptComponent {

}
