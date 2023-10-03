import mongoose from 'mongoose';

const MONGO_URI = 

mongoose.connect(MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'GameReview'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log('Error connecting to Mongo DB:', err));

const Schema = mongoose.Schema;

const gameSchema = new Schema ({
  title: {type: String, required: true},
  platform: {type: [String], required: true},
  // developer: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Developer'
  // }
})

const authorSchema = new Schema ({
  name: {type: String, required: true},
  verified: {type: Boolean, required: true}
})

const reviewSchema = new Schema ({
  rating: {type: Number, required: true},
  content: {type: String, required: true},
  author_id: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  },
  game_id: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }
})

const developerSchema = new Schema ({
  name: { type: String, required: true },
  founded: { type: String },
  headquarter: { type: String },
  games_created: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }]
});

const Game = mongoose.model('Game', gameSchema);
const Author = mongoose.model('Author', authorSchema);
const Review = mongoose.model('Review', reviewSchema);
const Developer = mongoose.model('Developer', developerSchema)

export default {
  Game,
  Author,
  Review,
  Developer
};
