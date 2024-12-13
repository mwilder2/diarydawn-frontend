export class Book {
  id?: number;
  userId?: number;
  title: string;
  description: string;
  order: number;
  updatedAt?: Date;
  createdAt?: Date;

  constructor(
    id: number,
    userId: number,
    title: string,
    description: string,
    order: number,
    updatedAt: Date,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.order = order;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}

export interface DeleteBookResult {
  confirmed: boolean;
}


export interface SaveNewBookResult {
  title: string;
  description: string;
  order: number;
}

export interface UpdateBookDto {
  title: string;
  description: string;
  order: number;
}

export interface DialogData {
  book: Book;
  isNewBook: boolean;
}