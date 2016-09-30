import fetch from 'isomorphic-fetch';
import mapValues from 'lodash/fp/mapValues';
import mutation from './mutation';
import GraphQlClient from './graphql';

const gqlClient = new GraphQlClient('http://localhost:8080/graphql');

let lastUpdated = 0;
function pullGlobus() {
  if(lastUpdated==0){
    fetchApollo();
  }
  console.log(new Date().toString(), "Fetching...");
  fetch('http://www.globus.de/kfz?markt=dut')
    .then(function(res) {
      //console.log(res.statusText, res.status)
        return res.json();
    }).then((json) => {
      return mapValues(Number)(json);
    }).then((data) => {
      if(lastUpdated != 0 && data.datum != lastUpdated){
        sendToApollo(data);
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
      if(data && data.addGasData && data.addGasData.lastUpdated){
        return data.addGasData.lastUpdated;
      }else {
        throw new Error('No Data available.');
      }
    }).then((last)=>{
      lastUpdated = last;
      return last;
    });
}

function fetchApollo(){
  console.log(new Date().toString(), 'FetchApollo...');
  const query = `{
    lastGasData{
      lastUpdated
    }
  }`;
  gqlClient.query(query)
    .then((data)=>{
      if(data && data.lastGasData && data.lastGasData.lastUpdated){
        return data.lastGasData.lastUpdated;
      }else {
        if(data && data.lastGasData == null){
          return 1;
        }
        throw new Error('No Data available.');
      }
    }).then((last)=>{
      lastUpdated = last;
      return last;
    });
}

export default pullGlobus;
