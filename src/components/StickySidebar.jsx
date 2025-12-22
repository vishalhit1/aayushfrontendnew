import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.jsx";
import "../styles/layout.css";

const StickySidebar = () => {
  const { cartItems } = useContext(CartContext);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleCart = () => setCartOpen(!cartOpen);

  const total = cartItems?.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${cartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>My Cart</h3>
          <button className="close-btn" onClick={toggleCart}>
            {cartOpen ? "➤" : "◀"}
          </button>
        </div>
        <div className="cart-items">
          {cartItems?.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems?.map((item) => (
              <div className="cart-item" key={item.id}>
                <p>{item.name}</p>
                <span>
                  {item.qty} × ₹{item.price}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <p>Total: ₹{total}</p>
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>

      {/* Floating Cart Button (Mobile) */}
      <button className="floating-cart-btn" onClick={toggleCart}>
        🛒 {cartItems?.length}
      </button>
    </>
  );
};

export default StickySidebar;
