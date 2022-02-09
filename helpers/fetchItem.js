const fetchItem = async (sku) => {
  try {
    const url = `https://api.mercadolibre.com/items/${sku}`;
    const result = await fetch(url);
    const data = result.json();
    return data;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
