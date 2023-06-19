const axios = require('axios');

export const getNftDataFromIndexer = (token_id: string, contract_id: string) => {
  const data = JSON.stringify({
    query: `query GetNftData($where: nfts_bool_exp!) {
      near {
        nfts(where: $where) {
          id
          token_id
          name
          media_type
          media_url
          ranking
          collection {
            title
            slug
            id
            floor
            contract_id
            verified
            cover_url
            discord
            twitter
          }
          staked
          owner
          rarity
          properties
        }
      }
    }`,
    variables: { "where": { "token_id": { "_eq": token_id }, "collection": { "slug": { "_eq": contract_id } } } }
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.indexer.xyz/graphql',
    headers: {
      'x-api-key': process.env.X_API_KEY,
      'x-api-user': process.env.X_API_USER,
      'Content-Type': 'application/json'
    },
    data: data
  };

  return new Promise<any | null>((resolve, reject) => {
    axios.request(config)
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error: any) => {
        console.log(error);
        reject(null);
      });
  });
}





