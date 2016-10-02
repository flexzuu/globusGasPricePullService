const mutation = `
mutation ($lastUpdated: Date!, $e5: Float, $e10: Float, $superPlus: Float, $diesel: Float, $autogas: Float) {
  addGasData(lastUpdated: $lastUpdated, e5: $e5, e10: $e10, superPlus: $superPlus, diesel: $diesel, autogas: $autogas) {
    id
    lastUpdated
  }
}
`;
export default mutation;
