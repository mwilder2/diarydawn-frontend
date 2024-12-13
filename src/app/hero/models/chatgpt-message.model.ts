export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'chatbot';
  type?: 'text' | 'image' | 'link';
  status?: 'sent' | 'received' | 'read';
}
