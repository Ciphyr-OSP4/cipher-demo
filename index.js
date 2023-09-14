// set up server and tells apollo how to handle the data
import { ApolloServer } from '@apollo/server';
// start up server so we can listen for requests
import { startStandaloneServer } from '@apollo/server/standalone';
import express from 'express'
import ciphyr from './ciphyrController.js';


//db
import db from './_db.js';
//types
import { typeDefs } from './schema.js';

const resolvers = {
  //Query type is the root(starting point)
  Query: {
    //think of revolver functions as methods in a class/constructor
    games() {
      return db.games;
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    //3 arguments you can pass in: 1. parent 2. args 3. context
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
  },
  Game: {
    //access the id of the game via parent arg
    reviews(parent) {
      //filter out any reviews that dont have the game id from the parent
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      //many to one relationship (many reviews to one author)
      return db.authors.find((a) => a.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((g) => g.id === parent.game_id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
      //if youre using MongoDb, you would use their library instead of .filter
      db.games = db.games.filter((g) => g.id !== args.id);
      return db.games;
    },
    addGame(_, args) {
      let game = {
        //spread the properties given in the args
        ...args.game,
        //add a id property with the value of a random string(number) from 0-10000
        id: Math.floor(Math.random() * 10000).toString(),
      };
      db.games.push(game);
      return game;
    },
    updateGame(_, args) {
      //mapping through the array and create a new array and checking each element
      db.games = db.games.map((g) => {
        if (g.id === args.id) {
          //spread args.edits into the obj of the current game
          return { ...g, ...args.edits };
        }
        //if dont match just return back the game
        return g;
      });
      return db.games.find((g) => g.id === args.id);
    },
  },
};



//server setup

const app = express();

//option to make myPlugin(ciphyr plugin) stored in env file and just add it to plugin when creating a new instances of ApolloServer

const myPlugin = {
  async serverWillStart() {
    console.log('Server starting up!');
    // if (1 !== 2) {
    //   return console.log('verification failed')
    // }
  },
  // ciphyr.convertStr is used in this event to sanitize query logs and send them to DB
  async requestDidStart() {
    console.log('In requestDidStart');
    ciphyr.getStartTime();
    return {
      async willSendResponse(requestContext) {
        console.log('In willSendResponse')
        ciphyr.convertStr(requestContext);
      }
    }
  }

};

const server = new ApolloServer({
  //Apollo server takes in a object with 2 props
  //typeDefs(type definitions) = descriptions of datatypes and relationship with other datatypes
  //Ex: name, games, authors ( or whatever you use in your database )
  typeDefs,
  //resolvers: resolver functions determines how we responses to querys for diff data on the graph
  //Ex: games => fetch all the games with resolver function
  resolvers,
  // more than one pluging?
  plugins: [myPlugin]
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`server ready at port, ${url}`);
