import mongoose from 'lib/mongoose';
import { VotingSessionSchema } from './voting-session';

const GoalSchema = new mongoose.Schema({
  chapter: {
    number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
  },

  dates: {
    created: {
      type: Date,
      required: true,
    },
    due: {
      type: Date,
    },
    finished: {
      type: Date,
    },
  },
});

const SeasonSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },

  votingSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VotingSession',
  },

  goals: [GoalSchema],

  dates: {
    created: {
      type: Date,
      required: true,
    },
    started: {
      type: Date,
    },
    finished: {
      type: Date,
    },
  },
}, {
  id: false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true,
  }
});

SeasonSchema.virtual('status').get(function() {
  return this.dates.finished
    ? 'COMPLETE'
    : this.dates.started
      ? 'STARTED'
      : 'PREPARED';
});

SeasonSchema.statics.getOpenSeason = function() {
  const Model = this;
  return Model.find({
    "dates.finished": {
      $exists: false,
    },
  })
    .populate('votingSession')
    .populate('book')
    .exec()
    .then(models => {
      if(models.length < 2) {
        return models[0];
      } else {
        throw 'Error: too many open seasons.';
      }
    });
};

SeasonSchema.statics.getPreviousSeason = function() {
  const Model = this;
  return Model.find({
    "dates.finished": {
      $exists: true,
    },
  })
    .sort({ 'dates.finished': 'descending' })
    .populate('votingSession')
    .populate('book')
    .exec()
    .then(models => {
      return models[0];
    });
};

const SeasonModel = mongoose.model('Season', SeasonSchema);

export {
  SeasonModel,
  SeasonSchema
};