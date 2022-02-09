const mainSection = document.querySelector('.items');
const cartElement = document.querySelector('.cart__items');
const buttonClearCart = document.querySelector('.empty-cart');
const subTotal = document.querySelector('.total-price');
let checkoutArray = [];

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// Captura os produtos retornados da API e adiciona na seção principal do HTML
async function getProductInfos(productName) {
  const data = await fetchProducts(productName);
  data.results.forEach((product) => {
    const productObj = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    mainSection.appendChild(createProductItemElement(productObj));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function calculateTotal() {
  let totalPrice = 0;
  checkoutArray.forEach((product) => {
    const { salePrice } = product;
    totalPrice += parseFloat(salePrice);
  });
  if (checkoutArray.length === 0) totalPrice = 0;
  subTotal.innerHTML = `${totalPrice}`;
}

function cartItemClickListener(event) {
  const cartProduct = event.target;
  const productInfos = cartProduct.innerText.split(' |', 1);
  const id = productInfos[0].split(': ', 2);
  for (let index = 0; index < checkoutArray.length; index += 1) {
    if (id[1] === checkoutArray[index].sku) {
      checkoutArray.splice(index, 1);
      break;
    }
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// função criada com dica do Roberval na monitoria dia 03/02
// Percorre o array com os elementos, faz o li e apensa à seção do carrinho
function setCart() {
  cartElement.innerHTML = '';
  if (checkoutArray.length > 0) {
    checkoutArray.forEach((product) => {
      const { sku, name, salePrice } = product;
      const productElement = createCartItemElement({ sku, name, salePrice });
      cartElement.appendChild(productElement);
      calculateTotal();
    });
  }
}

// Adiciona os itens clicados ao array e altera o local storage
async function addProductToArrayCart(event) {
  const clickedProduct = event.target;
  const productSku = clickedProduct.parentNode.children[0];
  const productInfos = await fetchItem(productSku.innerHTML);
  const { id, title, price, thumbnail } = productInfos;
  checkoutArray.push({
    sku: id,
    name: title,
    salePrice: price,
    image: thumbnail,
  });
  setCart();
  saveCartItems(JSON.stringify(checkoutArray));
}

function addListenerButtons() {
  const arrButtons = document.querySelectorAll('.item__add');
  arrButtons.forEach((button) => {
    button.addEventListener('click', addProductToArrayCart);
  });
}

buttonClearCart.addEventListener('click', () => {
  cartElement.innerHTML = '';
  checkoutArray = [];
  saveCartItems(checkoutArray);
  calculateTotal();
});

cartElement.addEventListener('click', setCart);

window.onload = () => {
  getProductInfos('computador').then(() => {
    addListenerButtons();
    mainSection.firstElementChild.remove();
  });
  if (localStorage.getItem('cartItems')) {
    checkoutArray = JSON.parse(getSavedCartItems('cartItems'));
    setCart();
  }
};
