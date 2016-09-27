class GraphQlClient{
  constructor(url){
    this.url = url;
  }
  query(query, variables = {}, options = {debug:false}) {
    const body = JSON.stringify({
      "query": query,
      "variables": variables,
    });
    return fetch(this.url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body,
    })
    .then(function(response) {
      if (options.debug) {
        console.log(response.statusText, response.status)
      }
      return response.json();
    })
    .then((json)=>{
      if(json.data){
        return json.data;
      }else if (json.errors) {
        throw new Error(json.errors[0].message)
      }{
        throw new Error('Unknown Error');
      }
    });
  }
}
export default GraphQlClient;
