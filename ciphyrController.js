import gql from 'graphql-tag';
import db from './postgreSQL.js';
// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();
const ciphyr = {};


ciphyr.convertStr = async (query) => {

  // const nested = (str) => {
  //   let max = -Infinity;
  //   let count = 0;
  //   for(let i = 1; i < str.length-1; i++) {
  //     if (str[i] === '{') {
  //       count++;
  //     } 
  //     if (str[i] === '}') {
  //       if (count > max) {
  //         max = count;
  //       }
  //       count = 0;
  //     }
  //   }
  //   return max;
  // }

  const nested = (str) => {
    let max = 0;
    let count = 0;

    for(let i = 0; i < str.length; i++) {
        if (str[i] === '{') {
            count++;
            if (count > max) {
                max = count;
            }
        } else if (str[i] === '}') {
            count--;
        }
    }

    return max - 1;  // Subtract 1 because the outermost brackets should not be considered in the count
  }


  const queryString = query.request.query;
  // Parse the GraphQL query string into an AST
  const queryAST = gql(queryString);
  // Convert the AST to a JavaScript object
  const queryObject = JSON.parse(JSON.stringify(queryAST));
  const definitions = queryObject.definitions; 
  
  const result = {};
  //type of query
  result.operation = definitions[0].operation;
  //name of query
  result.queryName = definitions[0].name.value;
  //query string
  result.queryString = queryString.replace(/ /g, '').replace(/\s+/g, '')
    .replace(`${result.operation}`, '').replace(`${result.queryName}`,'');
  //query string structure
  result.raw = queryString;
  //depth of query
  result.depth = nested(queryString);
  console.log(result)

  const sqlQuery = `INSERT INTO log (operation, query_name, log, raw, depth, api_key) 
    VALUES ('${result.operation}', '${result.queryName}', 
      '${result.queryString}', '${result.raw}', '${result.depth}', '${process.env.API_KEY}');`
  try {
    const output = await db.query(sqlQuery);
    console.log(output);
  } catch(err) {
    console.log(err);
  }
  
}

// accessing queryObject
// console.log(queryObject.definitions[0].selectionSet.selections[0].selectionSet.selections[0].name);


export default ciphyr;