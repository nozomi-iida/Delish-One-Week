const applicationId = process.env.RAKUTEN_API_KEY

export const fetchDataAction = async(dispatch: any) => {
  const URL = `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&applicationId=${applicationId}`
  const data = await fetch(URL);
  const dataJSON = await data.json();
  return dispatch({
    type: 'FETCH_DATA',
    payload: dataJSON._embedded.episodes
  });
};
