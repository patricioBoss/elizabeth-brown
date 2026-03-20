import axios from 'axios';

export const getUserById = (url: string) => axios.get(url).then((res) => res.data.data);

export const getQuotes = async (quoteString: string) => {
  const url = `/yahooapi/quotes?symbols=${quoteString}`;
  const stocksResponse = await axios.get(url);
  return stocksResponse.data.data;
};

export const getCoinPricesApi = async () => {
  try {
    const { data } = await axios.get('/api/fetch-coin-prices');
    return data.data;
  } catch (error) {
    console.log('Error fetching coin prices:', error);
    return null;
  }
};
