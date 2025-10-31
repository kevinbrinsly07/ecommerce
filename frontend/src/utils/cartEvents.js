export const CART_UPDATED = 'cart-updated';

export const dispatchCartUpdate = () => {
  window.dispatchEvent(new CustomEvent(CART_UPDATED));
};