import { CustomersInterface } from './ICustomer';
import { RoomInterface } from './IRoom';

export interface BookingInterface {
  ID: number;  // Remove the optional flag
  CheckIn: string;
  CheckOut: string;
  CustomerID: number | null;
  Customer?: CustomersInterface;
  RoomID: number | null;
  Room?: RoomInterface;
  PaymentMethod?: string; // Add PaymentMethod if needed
}

