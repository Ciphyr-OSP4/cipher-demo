import gql from 'graphql-tag';
import db from './postgreSQL.js';



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

  const sqlQuery = `INSERT INTO log (operation, query_name, log, raw, depth) 
    VALUES ('${result.operation}', '${result.queryName}', '${result.queryString}', '${result.raw}', ${result.depth});`
  try {
    const output = await db.query(sqlQuery);
    console.log(output);
  } catch(err) {
    console.log(err);
  }
  
}

// SQL log table:
// id SERIAL PRIMARY KEY,
// operation VARCHAR(255),
// query_name VARCHAR(255),
// log TEXT,
// raw TEXT,
// depth INT,
// timestamp TIMESTAMP default NOW()
// const DB_URI='postgres://bhszlgbk:zuzE1pauHpwZIV6iAPydMfKOhb1p8rYx@berry.db.elephantsql.com/bhszlgbk' 
    
    
    



  //console.log(queryObject.definitions[0].selectionSet.selections[0].selectionSet.selections[0].name);

  // "query ExampleQuery {\n  reviews {\n    id\n  }\n  games {\n    id\n  }\n  authors {\n    id\n  }\n}"
  // context = context.replace(/ /g, '');
  //console.log(queryString.replace(/\s+/g, ''))


export default ciphyr;