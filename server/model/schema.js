//5 types
//Int
//Floats
//Strings
//Boolean
//ID = key for data obj
// adding a ! at the end of a value means it is required (similar to user schema require: true)
//dont need to use commas like in an obj for each property

const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!]
    developer: Developer
  }
  type Review {
    id: ID!
    rating: Int!
    content: String!
    game: Game!
    author: Author!
  }
  type Author {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!]
  }
  type Developer {
    id: ID!
    name: String!
    founded: String
    headquarters: String
    games_created: [Game!]
  }
  type Query {
    reviews: [Review!]!
    review(id: ID!): Review
    games: [Game!]!
    game(id: ID!): Game
    authors: [Author!]!
    author(id: ID!): Author
    developers: [Developer!]!
    developer(id: ID!): Developer
  }
  type Mutation {
    addGame(game: AddGameInput!): Game
    deleteGame(id: ID!): Game
    updateGame(id: ID!, edits: EditGameInput!): Game
  }
  input AddGameInput {
    title: String!,
    platform: [String!]!
  }
  input EditGameInput {
    title: String,
    platform: [String!],
  }
`;

export default typeDefs;