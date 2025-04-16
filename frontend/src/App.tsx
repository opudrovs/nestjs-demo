import { OrderForm } from "./components/OrderForm";

import "./App.css";

/**
 * Main application component.
 * This component serves as the entry point for the application.
 * It renders the main title and the OrderForm component.
 */
function App() {
  return (
    <>
      <h1>NestJS API Demo</h1>
      <OrderForm />
    </>
  );
}

export default App;
