import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Laptop", price: 650, emoji: "💻" },
  { id: 2, name: "Mouse", price: 15, emoji: "🖱️" },
  { id: 3, name: "Keyboard", price: 25, emoji: "⌨️" },
  { id: 4, name: "Monitor", price: 120, emoji: "🖥️" },
];

function App() {
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState([]);
  const [shipping, setShipping] = useState("standard");
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [order, setOrder] = useState(null);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const shippingFee =
    shipping === "express" ? 10 : shipping === "standard" ? 5 : 0;

  const grandTotal = subtotal + shippingFee;

  function addToCart(product) {
    setCart((oldCart) => {
      const found = oldCart.find((item) => item.id === product.id);

      if (found) {
        return oldCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...oldCart, { ...product, qty: 1 }];
    });
  }

  function updateQty(id, amount) {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + amount }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeProduct(id) {
    setCart((oldCart) => oldCart.filter((item) => item.id !== id));
  }

  function placeOrder(event) {
    event.preventDefault();

    const newOrder = {
      id: "ORD-0001",
      customer: { ...customer },
      date: new Date().toLocaleString(),
      products: [...cart],
      total: grandTotal,
      status: "Pending",
      shipping,
    };

    setOrder(newOrder);
    setCart([]);
    setPage("confirmation");
  }

  function Header() {
    return (
      <header>
        <h2>🛍️ My Online Shop</h2>
        <nav>
          <button onClick={() => setPage("shop")}>Home</button>
          <button onClick={() => setPage("cart")}>
            Cart ({cart.reduce((sum, item) => sum + item.qty, 0)})
          </button>
        </nav>
      </header>
    );
  }

  function Summary() {
    return (
      <div className="summary">
        <h3>Order Summary</h3>
        <p>Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>
        <p>Shipping: <strong>${shippingFee.toFixed(2)}</strong></p>
        <hr />
        <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />

      {page === "shop" && (
        <>
          <h1>Our Products</h1>
          <div className="products">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="emoji">{product.emoji}</div>
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <button onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {page === "cart" && (
        <>
          <h1>Shopping Cart</h1>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-list">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>${item.price.toFixed(2)} each</p>
                    </div>

                    <div className="quantity">
                      <button onClick={() => updateQty(item.id, -1)}>
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}>
                        +
                      </button>
                    </div>

                    <strong>
                      ${(item.price * item.qty).toFixed(2)}
                    </strong>

                    <button
                      className="remove"
                      onClick={() => removeProduct(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <Summary />

              <button
                onClick={() => setPage("checkout")}
                className="main-button"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </>
      )}

      {page === "checkout" && (
        <>
          <h1>Checkout Form</h1>

          {cart.length === 0 ? (
            <p>Your cart is empty. Please add products first.</p>
          ) : (
            <div className="checkout">
              <form onSubmit={placeOrder}>
                <label>First Name</label>
                <input
                  required
                  value={customer.firstName}
                  onChange={(e) =>
                    setCustomer({ ...customer, firstName: e.target.value })
                  }
                  placeholder="Enter first name"
                />

                <label>Last Name</label>
                <input
                  required
                  value={customer.lastName}
                  onChange={(e) =>
                    setCustomer({ ...customer, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                />

                <label>Email</label>
                <input
                  required
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  placeholder="Enter email"
                />

                <label>Phone Number</label>
                <input
                  required
                  type="tel"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />

                <label>Address</label>
                <textarea
                  required
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="Enter your address"
                />

                <label>Shipping Method</label>
                <select
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                >
                  <option value="standard">Standard - $5</option>
                  <option value="express">Express - $10</option>
                  <option value="pickup">Store Pickup - Free</option>
                </select>

                <Summary />

                <button type="submit" className="main-button">
                  Place Order
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {page === "confirmation" && order && (
        <div className="confirmation">
          <h1>✅ Order Placed Successfully!</h1>
          <h2>Order ID: {order.id}</h2>
          <p>
            <strong>Customer Name:</strong>{" "}
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p><strong>Email:</strong> {order.customer.email}</p>
          <p><strong>Phone:</strong> {order.customer.phone}</p>
          <p><strong>Address:</strong> {order.customer.address}</p>
          <p><strong>Order Date:</strong> {order.date}</p>

          <h3>Ordered Products</h3>
          {order.products.map((item) => (
            <p key={item.id}>
              {item.name} × {item.qty} = ${(item.price * item.qty).toFixed(2)}
            </p>
          ))}

          <h2>Total Amount: ${order.total.toFixed(2)}</h2>
          <p><strong>Order Status:</strong> Pending</p>

          <button
            className="main-button"
            onClick={() => setPage("shop")}
          >
            Back to Shop
          </button>
        </div>
      )}
    </div>
  );
}

export default App;