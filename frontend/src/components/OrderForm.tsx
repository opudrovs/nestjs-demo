import { useState } from "react";
import styles from "./OrderForm.module.css";

const API_URL = "http://localhost:3000/orders";

/**
 * OrderForm component allows users to place an order for a property.
 * It includes input fields for property ID and quantity, and handles form submission.
 * It also displays success or error messages based on the API response.
 */
export const OrderForm = () => {
  const [propertyId, setPropertyId] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data);
        const errorMessage = data?.message || "Order failed";
        throw new Error(errorMessage);
      }

      console.log("Order created successfully:", data);
      setMessage(`Order placed! Order ID: ${data.id}`);
    } catch (err: unknown) {
      console.error("Error placing order:", err);
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Place an Order</h2>

      <label htmlFor="propertyId">Property ID</label>
      <input
        type="number"
        id="propertyId"
        value={propertyId}
        onChange={(e) => setPropertyId(parseInt(e.target.value))}
        onFocus={(e) => e.target.select()}
        required
        min={1}
        autoFocus
      />

      <label htmlFor="quantity">Quantity</label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        onFocus={(e) => e.target.select()}
        required
        min={1}
      />

      <button type="submit">Place Order</button>

      <div className={styles.message}>
        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </form>
  );
};
