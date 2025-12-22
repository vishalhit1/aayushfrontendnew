import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import { Loader2 } from "lucide-react";
import API from "../api/axios";

const PaymentProcessing = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  useEffect(() => {
    if (!orderId) return;

    const verifyPayment = async () => {
      try {
        await await API.get(
          `/api/payment/verify-lab-payment-link?order_id=${orderId}`
        );

        // Auto-close window after verification attempt
        setTimeout(() => {
          window.close();
        }, 5000);

      } catch (err) {
        console.error("Payment verification failed");
      }
    };

    verifyPayment();
  }, [orderId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6f8",
      }}
    >
      <div
        className="p-4 bg-white rounded shadow"
        style={{ maxWidth: 450, width: "100%", textAlign: "center" }}
      >
        {/* <Loader2 className="mx-auto mb-3 text-primary" size={36} /> */}

        <h4>Payment Submitted</h4>

        <p className="text-muted mt-2">
          Your payment has been submitted successfully on Cashfree.
        </p>

        <p className="text-muted">
          We are verifying the payment.
          <br />
          This window will close automatically.
        </p>

        {orderId && (
          <Alert variant="light" className="mt-3">
            <strong>Order ID</strong>
            <div className="small">{orderId}</div>
          </Alert>
        )}

        <Alert variant="info" className="mt-3 small">
          You do not need to stay on this page.
          <br />
          Your booking will be updated automatically.
        </Alert>

        <div className="d-flex gap-2 justify-content-center mt-3">
          {/* <Button
            variant="outline-primary"
            onClick={() => window.close()}
          >
            Close Now
          </Button> */}

          <Button
            variant="primary"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </Button>
        </div>

        <p className="text-muted small mt-3">
          If payment was successful but status doesn’t update,
          please contact support.
        </p>
      </div>
    </div>
  );
};

export default PaymentProcessing;