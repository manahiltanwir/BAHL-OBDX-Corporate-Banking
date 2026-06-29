export default function objectToQueryString(obj: Object) {
  const queryString = Object.entries(obj)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return queryString
}

// const obj = { name: 'Faizan', age: 21 };
// const queryString = objectToQueryString(obj);
// console.log(queryString); // Output: "name=Faizan&age=21"
