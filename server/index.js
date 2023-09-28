// set up server and tells apollo how to handle the data
import { ApolloServer } from '@apollo/server';
// start up server so we can listen for requests
import { startStandaloneServer } from '@apollo/server/standalone';
//import express from 'express'
import ciphyr from 'ciphyr';


//types
import typeDefs from './model/schema.js';
//resolvers
import resolvers from './model/resolver.js'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // supports more than one pluging
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
