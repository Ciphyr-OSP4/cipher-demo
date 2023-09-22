import db from "./mongoModel.js"
//import { typeDefs } from './schema'

const resolvers = {

  //These are the root-level query resolvers. 
  //Whenever a client sends a query to your GraphQL server, these resolvers are the entry points.
  //They typically fetch and return the main sets of data the client is asking for.
  Query: {
    async games() {
        let gamesList = await db.Game.find().exec();
        gamesList = gamesList.map(game => {
          game.id = game._id;
          return game;
        });
        return gamesList;
    },
    async game(_, args) {
        let game = await db.Game.findById(args.id).exec();
        if (game) {
          game.id = game._id;
          return game;
        }
        throw new Error('Game not found');
    },
    async developers() {
      let devList = await db.Developer.find().exec();
      devList = devList.map(developer => {
        developer.id = developer._id;
        return developer;
      });
      return devList;
    },
    async developer(_, args) {
      let developer = await db.Developer.findById(args.id).exec();
      if (developer) {
        developer.id = developer._id;
        return developer;
      }
      throw new Error('Developer not found');
    },
    async authors() {
        let authorsList = await db.Author.find().exec();
        authorsList = authorsList.map(author => {
          author.id = author._id;
          return author;
        });
        return authorsList;
    },
    async author(_, args) {
        let author = await db.Author.findById(args.id).exec();
        if (author) {
          author.id = author._id;
          return author;
        }
        throw new Error('Author not found');
    },
    async reviews() {
        let reviewsList = await db.Review.find().exec();
        reviewsList = reviewsList.map(review => {
          review.id = review._id;
          return review;
        });
        return reviewsList;
    },
    async review(_, args) {
        let review = await db.Review.findById(args.id).exec();
        if (review) {
          review.id = review._id;
          return review;
        }
        throw new Error('Review not found');
    },
  },

  //These are not root-level. 
  //They are used to resolve fields on specific types (or objects) that might require additional fetching or computation.
  //They are particularly useful when dealing with relational data.
  Game: {
    async reviews(parent) {
        let reviewsList = await db.Review.find({ game_id: parent.id }).exec();
        return reviewsList.map(review => {
          review.id = review._id;
          return review;
        });
    },
    async developer(parent) {
      const developer = await db.Developer.findOne({ games_created: parent._id }).exec();
      if (!developer) {
        throw new Error('Developer not found');
      }
      return developer;
    }
  },
  Author: {
    async reviews(parent) {
        let reviewsList = await db.Review.find({ author_id: parent.id }).exec();
        return reviewsList.map(review => {
          review.id = review._id;
          return review;
        });
    },
  },
  Review: {
    async author(parent) {
        let author = await db.Author.findById(parent.author_id).exec();
        if (author) {
          author.id = author._id;
          return author;
        }
        throw new Error('Author not found');
    },
    async game(parent) {
        let game = await db.Game.findById(parent.game_id).exec();
        if (game) {
          game.id = game._id;
          return game;
        }
        throw new Error('Game not found');
    },
  },
  Developer: {
    async games_created(parent) {
      try {
        // Assuming the games_created field contains an array of ObjectIds referencing the Game collection.
        const developerWithGames = await db.Developer.findById(parent.id).populate('games_created').exec();
        return developerWithGames.games_created;
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  Mutation: {
    // deleteGame still needs test
    async deleteGame(_, args) {
      try {
        // Find the game first
        const gameToDelete = await db.Game.findById(args.id).exec();
  
        if (!gameToDelete) {
          throw new Error(`Game with ID: ${args.id} was not found.`);
        }

        await gameToDelete.remove();
  
        return gameToDelete;
      } catch (err) {
        throw new Error(err);
      }
    },
    async addGame(_, args) {
      try{
        let game = new db.Game({
          title: args.game.title,
          platform: args.game.platform
        });
        await game.save();
        game.id = game._id;
        return game;
      } catch (err) {
        throw new Error(err);
      }
    },
    async updateGame(_, args) {
      try {
        let updatedGame = await db.Game.findByIdAndUpdate(args.id, { 
          title: args.edits.title,
          platform: args.edits.platform
        }, { new: true }).exec(); // The option { new: true } ensures the updated document is returned
        if (updatedGame) {
          updatedGame.id = updatedGame._id;
          return updatedGame;
        }
      } catch (err) {
        throw new Error(err);
      }
    }

  }

};

export default resolvers;