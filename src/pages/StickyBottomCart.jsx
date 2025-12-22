import React, { useEffect, useState, useContext, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
const StickyBottomCart = () => {
    const { labCart, addToLabCart, removeFromLabCart } = useContext(CartContext);
    // ---- StickyCart now receives 'totalAmount' prop and shows it ----
    const StickyCart = ({ count, totalAmount, visible }) => {
        return (
            <div
                className={`sticky-lab-cart${visible ? " show" : ""}`}
                style={{
                    position: "fixed",
                    bottom: "0px",
                    left: 0,
                    right: 0,
                    margin: "0 auto",
                    zIndex: 9,
                    width: "100%",
                    display: visible ? "initial" : "none",
                    alignItems: "center",
                    background: "radial-gradient(50% 50% at 50% 50%, #EDF4F5 0%, #FFFFFF 100%)",
                    boxShadow: "0px 4px 4px 0px #00000040",
                    borderRadius: "0px",
                    padding: "15px",
                    borderTop: "3px solid #0a6573",
                    justifyContent: "center",
                }}
            >
                <div className="sticky-cart-all">
                    <div className="numbers-abcd">
                        <h3>
                            {count} {count === 1 ? "item" : "items"} in cart
                        </h3>
                        {/* Show total amount */}
                        <h6>
                            ₹{totalAmount}
                        </h6>
                    </div>
                    <Link to="/cart" className="go-to-cart-news">Go to Cart <i className="fa fa-chevron-right ms-1"></i></Link>
                </div>
            </div>
        );
    };

    const totalAmount = labCart && labCart.length > 0
        ? labCart.reduce((acc, t) => acc + (t.price || 0), 0)
        : 0;

    // Do not show sticky cart if empty
    const showStickyCart = labCart && labCart.length > 0;
    return (
        <div>
            <StickyCart
                count={labCart.length}
                totalAmount={totalAmount}
                visible={showStickyCart}
            />
        </div>
    )
}

export default StickyBottomCart


