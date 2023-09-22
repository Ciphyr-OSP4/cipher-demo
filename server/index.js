// set up server and tells apollo how to handle the data
import { ApolloServer } from '@apollo/server';
// start up server so we can listen for requests
import { startStandaloneServer } from '@apollo/server/standalone';
//import express from 'express'
import ciphyr from './ciphyr_package/ciphyrController.js';


//types
import { typeDefs } from '../schema.js';
//resolvers
import { resolvers } from './model/resolver.js'

//server setup

//const app = express();

//option to make myPlugin(ciphyr plugin) stored in env file and just add it to plugin when creating a new instances of ApolloServer

// const myPlugin = {
//   async serverWillStart() {
//     console.log('Server starting up!');
//     // if (1 !== 2) {
//     //   return console.log('verification failed')
//     // }
//   },
//   // ciphyr.convertStr is used in this event to sanitize query logs and send them to DB
//   async requestDidStart(context) {
//     console.log('In requestDidStart');
//     ciphyr.getStartTime();

//     return {
//       async willSendResponse(requestContext) {
//         console.log('In willSendResponse')

//         ciphyr.convertStr(requestContext);
//       }
//     }
//   }

// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // disable auto introspection query being sent every 2 seconds
  // introspection: false,
  // playground: {
  //   settings: {
  //     'schema.polling.enable': false, // enables automatic schema polling
  //     'schema.polling.endpointFilter': '*localhost*', // endpoint filter for schema polling
  //     'schema.polling.interval': 10000, // schema polling interval in ms
  //   }
  // },
  // more than one pluging?
  plugins: [ciphyr.myPlugin]
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`server ready at port, ${url}`);
