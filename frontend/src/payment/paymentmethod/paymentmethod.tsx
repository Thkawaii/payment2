import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { PaymentInterface } from '../interface/IPayment';
import { GetPaymentById } from '../services/https/PaymentAPI';
import { GetBookingsById, GetRoomsById } from '../../room/booking/services/https';
import { BookingInterface } from '../../room/booking/interfaces/IBooking';
import './App.css';
import { RoomInterface } from '../../room/booking/interfaces/IRoom';


function PaymentPage() {
    
  // State to track the selected payment method and whether to show payment options
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  // States for card inputs and validation errors
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setErrorMessage(''); // Clear error message when a payment method is selected
  };

  const validateForm = () => {
    let message = '';

    // Validate card number
    const cardNumberRegex = /^(\d{4}-){3}\d{4}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      message += '--Card Number must be in the format XXXX-XXXX-XXXX-XXXX and contain only numeric characters.\n';
    }

    // Validate expiration date
    if (!expirationDate.match(/^\d{2}\/\d{2}$/)) {
      message += '--Expiration Date must be in MM/YY format.\n';
    }

    // Validate CVV
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv)) {
      message += '--CVV must be a 3-digit number.\n';
    }

    if (message) {
      setErrorMessage(message);
      return false; // Prevent form submission
    }

    // Clear previous error messages and proceed
    setErrorMessage('');
    return true; // Allow form submission
  };


  const handleConfirm = () => {
    if (!paymentMethod) {
      setErrorMessage('Please select a payment method.');
      return;
    }
    
    if (paymentMethod === 'CreditCard' && !validateForm()) {
      return; // Stop if form is invalid
    }
    alert("Payment confirmed");
    navigate('/login/receipt'); // Navigate to the receipt page
  };
  
  const handleCancel = () => {
    setPaymentMethod(null);
    setCardNumber('');
    setExpirationDate('');
    setCvv('');
    setErrorMessage('');
    navigate('/login/payment'); // Navigate to the payment page
  };
  

  return (
    <div className="payment-wrapper">
  <div className="payment-container">
    <h2>Payment System</h2>

    {!showOptions ? (
      <button className="show-options" onClick={() => setShowOptions(true)}>
        Show Payment Options
      </button>
    ) : (
      <div>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="MobileBanking"
              onChange={() => handlePaymentMethodChange('MobileBanking')}
            />
            Mobile Banking
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="CreditCard"
              onChange={() => handlePaymentMethodChange('CreditCard')}
            />
            Credit/Debit Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Cash"
              onChange={() => handlePaymentMethodChange('Cash')}
            />
            Cash
          </label>
          {/* E-Wallets */}
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="TrueMoney"
              onChange={() => handlePaymentMethodChange('TrueMoney')}
            />
            TrueMoney
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Alipay"
              onChange={() => handlePaymentMethodChange('Alipay')}
            />
            Alipay
          </label>
        </div>

          <div className="payment-display">
            {paymentMethod === 'MobileBanking' && (
              <div className="qr-code-section">
              <p className="qr-text">Scan QR Code</p>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                  alt="QR Code"
                  className="qr-code"
                />
                 <p className="bank-text">Available By</p>
                <div className="bank-logos">
                  <img
                    src="https://www.a-p-electric.com/images/ready-template/crop-1611643734515.png"
                    alt="Bank logo"
                  />
                  <img
                    src="https://www.kasikornbank.com/SiteCollectionDocuments/about/img/logo/logo.png"
                    alt="Prompt Pay logo"
                  />
                  <img
                    src="https://i.pinimg.com/originals/fa/4b/4a/fa4b4a6ef2f95136051607a7fba619ba.png"
                    alt="Ohm sin"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/th/2/29/%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%84%E0%B8%97%E0%B8%A2.png"
                    alt="Ohm sin"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'CreditCard' && (
              <div className="credit-card-section">
                 <div className="credit-card-image-wrapper">
                <img
                  src="https://i0.wp.com/mrtintofamerica.com/wp-content/uploads/2016/02/visa-mastercard-amex-discov.png?ssl=1"
                  alt="Credit Card Image"
                  className="credit-card-image"
                />
                <div className="card-inputs">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    required
                  />
                  <input
                    type="text"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="Expiration Date"
                    required
                  />
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="CVV"
                    required
                  />
                </div>
                {errorMessage && <div id="credit-card-error-message" className="error-message">{errorMessage}</div>}
              </div>
              </div>
            )}

            {paymentMethod === 'Cash' && (
              <div className="cash-section">
              </div>
            )}
          </div>
          {paymentMethod === 'TrueMoney' && (
            <div className="truemoney-section">
              <p className="aa">Scan QR Code with TrueMoney App</p>
              <img
                src="https://www.truemoney.com/wp-content/uploads/2021/01/lp-LuckyBag-howto-step2-20190128-2.png"
                alt="TrueMoney QR Code"
                className="bb"
              />
            </div>
          )}
          {paymentMethod === 'Alipay' && (
            <div className="alipay-section">
              <p className="cc">Scan QR Code with Alipay App</p>
              <img
                src="https://vintagebeaute.store/cdn/shop/products/WhatsAppImage2022-02-05at2.28.14PM.jpg?v=1644042509"
                alt="Alipay QR Code"
                className="dd"
              />
            </div>
          )}
          {!paymentMethod && errorMessage && (
           <div className="general-error-message" style={{ color: 'red' }}>
              {errorMessage}
            </div>
          )}



          <div className="payment-actions">
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default PaymentPage;