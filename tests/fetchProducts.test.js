require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fecthProducts', () => {
  // implemente seus testes aqui
  const typeFunction = typeof fetchProducts;
  it('fetchProducts é uma função', () => {
    expect(typeFunction).toBe('function');
  });
  it('Verifica se a função está sendo chamada corretamente', async () => {
    const result = await fetchProducts('computador');
    expect(fetch).toHaveBeenCalled();
  });
  it('A chamada do fetchProducts com o argumento computador utiliza o endpoint correto', async () => {
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    await fetchProducts('computador');
    expect(fetch).toBeCalledWith(url);
  });
  it('Verifica se a função retorna o objeto correto', async () => {
    const result = await fetchProducts('computador');
    expect(result).toBe(computadorSearch);
  });
  it('Verifica se quando chamada sem parametros retorna erro', async () => {
    const result = await fetchProducts();
    expect(result).toEqual(new Error('You must provide an url'));
  })
});
