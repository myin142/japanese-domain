const axios = require('axios');

exports.lambdaHandler = async (event, context) => {
    const word = encodeURI(event.q);
    const response = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${word}`);

    return response.data;
};
