import gql from 'graphql-tag';
import { GraphQLError } from 'graphql';
import db from './postgreSQL.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const ciphyr = {};

// class ciphyr {
//   constructor(query)
// };

ciphyr.authError = new GraphQLError('You are not authorized.', {
  extensions: {
    code: 'Unauthorized',
  },
});

ciphyr.getStartTime = () => {
  ciphyr.startTime = Date.now();
}

// getAuthInfo need more test

ciphyr.getAuthInfo = (obj) => {
  const token = obj.contextValue.token
  // case: no Auth
  if (token === '') {
    return '';
  }

  // case: JWT
  if (true) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}

ciphyr.convertStr = async (query) => {

  const getDepth = (str) => {
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
  
  // console.log('Auth Info \n', ciphyr.getAuthInfo(query))
  // console.log('request header \n', query.request.http.headers)
  // console.log('request body \n', query.request)
  //console.log('Context\n', query.contextValue)

  // // if error is defined, classify query as error query and show error message, otherwise classify as success
  //console.log('response body error\n', query.response.body.singleResult.errors)

  const result = {};  
  //type of query
  result.operation = definitions[0].operation;
  //name of query (check if name is provided)
  result.queryName = (definitions[0].name === undefined) ? '' : definitions[0].name.value;
  //console.log('Query Name', result.queryName)
  //query string
  result.queryString = queryString.replace(/ /g, '').replace(/\s+/g, '')
    .replace(`${result.operation}`, '').replace(`${result.queryName}`,'');
  //query raw string
  result.raw = queryString;
  //depth of query
  result.depth = getDepth(queryString);
  // if error occured
  if (query.response.body.singleResult.errors === undefined) {
    result.error_occured = false;
    result.error_code = '';
  } else {
    result.error_occured = true;
    result.error_code = query.response.body.singleResult.errors[0].extensions.code
  }
  //latency of query 
  result.latency = Date.now() - ciphyr.startTime;

  console.log('result', result);

  ciphyr.savingQuery(result);
}

ciphyr.savingQuery = async (result) => {
  // will the user be willing to send query log to Ciphyr's database?
  // how to connect to user's own database instead
  const sqlQuery = `INSERT INTO log (operation, query_name, log, raw, depth, 
    latency, api_key, error_occured, error_code) 
    VALUES ('${result.operation}', '${result.queryName}', 
      '${result.queryString}', '${result.raw}', '${result.depth}', '${result.latency}', 
      '${process.env.API_KEY_3}', '${result.error_occured}', '${result.error_code}');`
  try {
    const output = await db.query(sqlQuery);
    console.log(output);
  } catch(err) {
    console.log(err);
  }
}

ciphyr.myPlugin = {
  async serverWillStart() {
    console.log('Server starting up!');
    // if (1 !== 2) {
    //   return console.log('verification failed')
    // }
  },
  // ciphyr.convertStr is used in this event to sanitize query logs and send them to DB
  async requestDidStart(context) {
    console.log('In requestDidStart');
    // if (true) {
    //   throw ciphyr.authError;
    // }
    ciphyr.getStartTime();

    return {
      async willSendResponse(requestContext) {
        console.log('In willSendResponse')

        ciphyr.convertStr(requestContext);
      }
    }
  }

};
// accessing queryObject
// console.log(queryObject.definitions[0].selectionSet.selections[0].selectionSet.selections[0].name);

export default ciphyr;