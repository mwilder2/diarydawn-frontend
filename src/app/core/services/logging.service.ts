import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  log(message: string): void {
    console.log(message);
    // Additional logic to send logs to a backend server
  }

  error(message: string, stack?: string): void {
    console.error(message);
    // Send error details to a backend server or external logging service
  }

  // You can add more methods for debug, info, warning, etc.
  info(message: string): void {
    console.info(message);
    // Send info logs to a backend server or external logging service
  }

  warn(message: string): void {
    console.warn(message);
    // Send warning logs to a backend server or external logging service
  }

  debug(message: string): void {
    console.debug(message);
    // Send debug logs to a backend server or external logging service
  }
}
