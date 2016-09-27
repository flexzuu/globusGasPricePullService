import fetch from 'isomorphic-fetch';
import mapValues from 'lodash/fp/mapValues';
import mutation from './mutation';
let lastUpdated = 0;
function pullGlobus() {
  console.log(new Date().toString(), "Fetching...");
  fetch('http://www.globus.de/kfz?markt=dut')
    .then(function(res) {
      console.log(res.statusText, res.status)
        return res.json();
    }).then((json) => {
      return mapValues(Number)(json);
    }).then((data) => {
      if(data.datum != lastUpdated){
        if(lastUpdated!=0){
          sendToApollo(data);
        }else {
          fetchApollo();
        }
      }else {
        console.log(new Date().toString(), "Up to date...");
      }
    });
}

function sendToApollo(data){
  console.log(new Date().toString(), 'Sending...');
  const variables = {
    lastUpdated: data.datum,
    e5: data.supere5,
    e10: data.supere10,
    diesel: data.diesel,
    superPlus: data.superplus,
    autogas: data.autogas,
  };
  const body = JSON.stringify({
    "query": mutation,
    "variables": JSON.stringify(variables)
  });
  fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body,
  })
  .then(function(response) {
    console.log(response.statusText, response.status)
    return response.json();
  })
  .then((json)=>{
    if(json.data){
      lastUpdated = json.data.addGasData.lastUpdated;
    }
    return json;
  })
}

function fetchApollo(){
  console.log(new Date().toString(), 'FetchApollo...');
  const body = JSON.stringify({
    "query": `{
  allGasData(last:1) {
    lastUpdated
    id
    e10
    diesel
  }
}`
  });
  fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body,
  })
  .then(function(response) {
    console.log(response.statusText, response.status)
    return response.json();
  })
  .then((json)=>{
    return json.data.allGasData[0].lastUpdated;
  })
  .then((json)=>{
    lastUpdated = json;
    return json;
  })
}

export default pullGlobus;
