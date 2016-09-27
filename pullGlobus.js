import fetch from 'isomorphic-fetch';
import mapValues from 'lodash/fp/mapValues';
import mutation from './mutation';
import GraphQlClient from './graphql';

const gqlClient = new GraphQlClient('http://localhost:8080/graphql');

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
  gqlClient.query(mutation, variables)
    .then((data)=>{
      lastUpdated = data.addGasData.lastUpdated;
    });
}

function fetchApollo(){
  console.log(new Date().toString(), 'FetchApollo...');
  const query = `{
    allGasData(last:1) {
      lastUpdated
      id
      e10
      diesel
    }
  }`;
  gqlClient.query(mutation)
    .then((data)=>{
      return data.allGasData[0].lastUpdated;
    }).then((last)=>{
      lastUpdated = last;
      return last;
    });
}

export default fetchApollo;
