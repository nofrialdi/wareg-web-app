import React, { createContext, useState } from 'react';
import axios from 'axios';
import { getCookie } from '@/libs/cookies';

interface Order {
  id: number;
  name: string;
  price: number;
  menuImages: {
    img1: string;
  };
}

interface CartProduct {
  product: Order;
  quantity: number;
}

interface CartContextProps {
  cartItems: number;
  cartProducts: CartProduct[];
  addToCart: (product: Order, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  addToCartServer: (product: Order) => Promise<void>;
  checkout: () => Promise<void>; // Add this line
}

export const CartContext = createContext<CartContextProps>({
  cartItems: 0,
  cartProducts: [],
  addToCart: (product: Order, quantity: number) => {},
  removeFromCart: (productId: number) => {},
  increaseQuantity: (productId: number) => {},
  decreaseQuantity: (productId: number) => {},
  addToCartServer: async (product: Order) => {},
  checkout: async () => {}, // Add this line
});

export const CartProvider: React.FC = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [cartItems, setCartItems] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  const addToCart = (product: Order, quantity: number) => {
    setCartItems((prevCount) => prevCount + quantity);
    setCartProducts((prevProducts) => [...prevProducts, { product, quantity }]);
  };

  const increaseQuantity = (productId: number) => {
    setCartProducts((prevProducts) =>
      prevProducts.map((cartProduct) =>
        cartProduct.product.id === productId
          ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
          : cartProduct,
      ),
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCartProducts((prevProducts) =>
      prevProducts.map((cartProduct) =>
        cartProduct.product.id === productId && cartProduct.quantity > 1
          ? { ...cartProduct, quantity: cartProduct.quantity - 1 }
          : cartProduct,
      ),
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevCount) => prevCount - 1);
    setCartProducts((prevProducts) =>
      prevProducts.filter(
        (cartProduct) => cartProduct.product.id !== productId,
      ),
    );
  };

  const checkout = async () => {
    const token = getCookie('token');
    for (const { product, quantity } of cartProducts) {
      try {
        await axios.post(
          'https://w17-wareg.onrender.com/orders',
          {
            orderItems: [
              {
                menuId: product.id,
                quantity,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          },
        );
        alert('Order placed successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to place order.');
      }
    }

    setCartItems(0);
    setCartProducts([]);
  };

  const addToCartServer = async (product: Order) => {
    const token = getCookie('token');
    try {
      await axios.post(
        'https://w17-wareg.onrender.com/orders',
        {
          orderItems: [
            {
              menuId: product.id,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      addToCart(product, 1);
      alert('Item added to cart!');
    } catch (error) {
      console.error(error);
      alert('Failed to add item to cart.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartProducts,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        addToCartServer, 
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
