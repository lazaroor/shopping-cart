const saveCartItems = (checkoutArray) => {
  localStorage.setItem('cartItems', checkoutArray);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
