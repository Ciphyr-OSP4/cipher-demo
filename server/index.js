// set up server and tells apollo how to handle the data
import { ApolloServer } from '@apollo/server';
// start up server so we can listen for requests
import { startStandaloneServer } from '@apollo/server/standalone';
//import express from 'express'
import ciphyr from './ciphyr_package/ciphyrController.js';


//types
import typeDefs from './model/schema.js';
//resolvers
import resolvers from './model/resolver.js'

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
  context: async ({ req, res }) => {
    // for demo purpose, we just want to record the authentication info along with the query log
    // there is no real authentication implemented

    // Get the user token from the headers.
    const token = req.headers.authorization || '';

    // Try to retrieve a user with the token (if verification is required to send API call)
    // const user = await getUser(token);
    return { token };
  },
  listen: { port: 4000 },
});

console.log(`server ready at port, ${url}`);
