const mongoose = require('mongoose');
const uuid = require('uuid');

const faker = require('../helpers/faker');

const { Schema } = mongoose;

const gameSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  uuid: {
    type: String,
    default: uuid.v1()
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  pin: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'ended'],
    default: 'pending'
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Player'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

// Factory
const GameFactory = {
  generate({ skipTitle = false, skipPin = false }) {
    const game = {
      description: faker.lorem.words(20)
    };

    if (!skipTitle) game.title = faker.random.words(20);
    if (!skipPin) game.pin = faker.random.alphaNumeric(8);

    return game;
  },

  async create({ user }) {
    const game = new Game({
      ...this.generate(),
      user
    });
    await game.save();

    return game;
  }
};