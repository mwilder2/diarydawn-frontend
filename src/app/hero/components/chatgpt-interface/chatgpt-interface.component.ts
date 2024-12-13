import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../../models/chatgpt-message.model';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chatgpt-interface',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './chatgpt-interface.component.html',
  styleUrls: ['./chatgpt-interface.component.scss']
})
export class ChatgptInterfaceComponent {
  messages: Message[] = [];
  inputText: string = '';
  loading: boolean = false; // Loading state

  constructor(private chatService: ChatService) { }

  scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.getElementById('messagesContainer');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } else {
        console.log('Messages container not found. Unable to scroll to the bottom.');
      }
    }, 100);
  }

  sendMessage(text: string): void {
    if (!text.trim()) return;

    this.loading = true;
    const newMessage: Message = {
      id: this.generateUniqueId(),
      text: text,
      timestamp: new Date(),
      sender: 'user'
    };
    this.messages.push(newMessage);

    this.chatService.sendMessage(text).subscribe({
      next: (response) => {
        this.loading = false; // Stop loading
        this.messages.push({
          id: this.generateUniqueId(),
          text: response, // Adjust based on the structure of your response
          timestamp: new Date(),
          sender: 'chatbot'
        });
        this.scrollToBottom();
      },
      error: (error) => {
        this.loading = false; // Stop loading
        console.error('Error receiving response from chat service:', error);
        this.messages.push({
          id: this.generateUniqueId(),
          text: 'Sorry, I am unable to respond at the moment.',
          timestamp: new Date(),
          sender: 'chatbot'
        });
        this.scrollToBottom();
      }
    });
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}