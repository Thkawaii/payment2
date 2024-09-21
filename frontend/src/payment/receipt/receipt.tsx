import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate
import { message } from 'antd'; // Import Ant Design message for notifications
import { GetBookings, GetRooms } from '../../room/booking/services/https';
import { BookingInterface } from '../../room/booking/interfaces/IBooking';
import { RoomInterface } from '../../room/booking/interfaces/IRoom';
import './App.css';
import { PaymentInterface } from '../interface/IPayment';
import { CreatePayments } from '../services/https/PaymentAPI';

function PaymentReceipt() {
  const [booking, setBooking] = useState<BookingInterface[]>([]);
  const [room, setRoom] = useState<RoomInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate(); // Initialize navigation hook
  const fetchBooking = async () => {
    try {
      const response = await GetBookings();
      console.log("API booking response for payment: ", response);
      if (Array.isArray(response)) {
        setBooking(response);
      } else {
        console.error("API did not return expected array format:", response);
        setBooking([]);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const fetchRoom = async () => {
    try {
      const response = await GetRooms();
      console.log("GetRooms response: ", response);
      if (Array.isArray(response)) {
        setRoom(response);
      } else {
        console.error("API did not return expected array format:", response);
        setRoom([]);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };
  useEffect(() => {
    fetchBooking();
    fetchRoom();
  }, []); // Empty array ensures it only runs on component mount

  console.log("booking for payment: ", booking);
  console.log("room for payment: ", room);
  const handleConfirm = async (booking_id: number) => {
    const selectedBooking = booking.find((b) => b.ID === booking_id);
  
    if (!selectedBooking) {
      console.error("Selected booking not found");
      return;
    }
  
    const roomID = selectedBooking.Room?.ID;
    let roomPrice: number = 0; // Initialize as a number
  
    if (roomID) {
      // Find room details from the room state
      const roomDetails = room.find(r => r.ID === roomID);
    }
    const handleConfirm = async (booking_id: number) => {
      const selectedBooking = booking.find((b) => b.ID === booking_id);
    
      if (!selectedBooking) {
        console.error("Selected booking not found");
        return;
      }
    
      const roomID = selectedBooking.Room?.ID;
      let roomPrice: number = 0; // Initialize as a number
    
      if (roomID) {
        // Find room details from the room state
        const roomDetails = room.find(r => r.ID === roomID);
    
        // Ensure roomPrice is a number
        roomPrice = roomDetails?.RoomTypes?.PricePerNight 
          ? Number(roomDetails.RoomTypes.PricePerNight) 
          : 0;
      }   
      console.log("Room Price: ", roomPrice);   
      const paymentData: PaymentInterface = {
        PaymentDate: new Date(),
        PaymentMethod: "credit",
        BookingID: booking_id,
        TotalAmount: 0
      };
    
      const res = await CreatePayments(paymentData);
      console.log("CreatePayments Response: ", res);
    
      if (res) {
        messageApi.open({
          type: "success",
          content: "Data saved successfully",
        });
    
        setTimeout(() => navigate("/login/PaymentMethod", { state: { paymentID: res.data.ID, bookingID: booking_id, roomID: roomID } }), 500);
      } else {
        messageApi.open({
          type: "error",
          content: "Error!",
        });
      }
    };
  }
  return (
    <div className="receipt">
      <header className="receipt-header">
        <h1>Payment Transaction History</h1>
      </header>

      <table className="receipt-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Customer</th>
            <th>Room</th>
            <th>Service Price</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
  {booking && booking.length > 0 ? (
    booking.map((b, index) => {
      const roomDetails = room.find((r) => r.ID === b.Room?.ID);
      return (
        <tr key={b.ID || index}>
          <td>{b.ID ?? 'N/A'}</td>
          <td>{b.Customer?.Name || 'N/A'}</td> {/* Provide 'N/A' if Name is undefined */}
          <td>{roomDetails?.RoomTypesId || '110'}</td>
          <td>{roomDetails?.RoomTypes?.Name || 'N/A'}</td>
          <td>{b.PaymentMethod || 'Credit Card'}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={5}>No payment transactions available</td>
    </tr>
  )}
</tbody>
      </table>

      <div className="receipt-total">
      </div>
    </div>
  );
};

export default PaymentReceipt;
