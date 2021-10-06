// função que busca a imagem do elemento
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Salvar lista em localStorage
function saveList() {
  const saveItens = document.querySelector('ol');
  localStorage.setItem('cartList', saveItens.innerHTML);
}

function subPrice(query) {
  const spanText = document.querySelector('.total-price');
  const calc = +(spanText.innerHTML) - query;
  spanText.innerHTML = parseFloat(calc);
}

// Recupera valor do elemento exluído
async function getSubPrice(element) {
  const idElement = element.innerText.substring(5, 18);
  try {
    const queryProduct = await fetch(`https://api.mercadolibre.com/items/${idElement}`)
      .then((promise) => promise.json())
        .then((result) => result.price);
        subPrice(queryProduct);
  } catch (error) {
    console.log('Erro ao calcular preços');
  }
}

// remover item selecionado
function cartItemClickListener(event) {
  // reference: https://www.w3schools.com/jsref/event_target.asp
  getSubPrice(event.target);
  event.target.remove();
  saveList();
}

// Carrerregar itens do localSotrage
function loadList() {
  const loadItens = document.querySelector('.cart__items');
  loadItens.innerHTML = localStorage.getItem('cartList');
  const li = document.querySelectorAll('li');
  li.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

// criação de um novo objeto
function createObject(obj) {
  return { sku: obj.id, name: obj.title, image: obj.thumbnail, salePrice: obj.price };
}

// Cria o elemento, adiciona a classe e um texto atribuído
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function sumPrice(price) {
  const spanText = document.querySelector('.total-price');
  // auxiliado por Gustavo Sant'Ana
  const calc = +(spanText.innerHTML) + price;
  spanText.innerHTML = parseFloat(calc);
}

// Desestrutura o objeto chamado e cria a lista de compra dos produtos
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrice(salePrice);
  return li;
}

// Recupera o ID do projeto para ser exibido no shopping cart
async function queryElement(objectId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${objectId}`);
  const reponseJson = await response.json()
    .then((result) => {
      document.querySelector('.cart__items')
        .appendChild(createCartItemElement(createObject(result)));
    });
  saveList();
  return reponseJson;
}

// Cria o elemento desustruturando o objeto retornado pela api
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const element = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  element.addEventListener('click', () => queryElement(sku));
  section.appendChild(element);
  return section;
}

// Faz a requisição da API principal necessária para o projeto
async function fecthProduct(query) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  return response.json();
}

// requisição do servidor pela api
async function returnFechJson() {
  try {
    const queryProduct = await fecthProduct('computador');
    queryProduct.results.forEach((product) => {
      const listProduct = document.querySelector('.items');
      listProduct.appendChild(createProductItemElement(createObject(product)));
    });
  } catch (error) {
    console.log('Erro na chamada da api');
  }
}

// Limpar carrinho de compras
function clearValues() {
  document.querySelector('ol').innerHTML = '';
  localStorage.removeItem('cartList');
}

// Selecionar elemento para limpar carrinho de compras
function clearListBtn() {
  const btnClear = document.querySelector('button');
  btnClear.addEventListener('click', clearValues);
  return btnClear;
}

window.onload = () => { 
  returnFechJson();
  loadList();
  clearListBtn();
};
