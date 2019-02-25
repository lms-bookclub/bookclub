import mongoose from 'lib/mongoose';
import { VotingSessionSchema } from './voting-session';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  genre: {
    type: String,
  },

  pitch: {
    type: String,
  },

  links: {
    goodreads: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },

  suggestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    value: {
      type: Number,
    }
  }],

  dates: {
    created: {
      type: Date,
      required: true,
    },
    proposed: {
      type: Date,
    },
    chosen: {
      type: Date,
    },
    finished: {
      type: Date,
    },
  },
}, {
  id: false,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
});

BookSchema.virtual('status').get(function() {
  return this.dates.finished
    ? 'FINISHED'
    : this.dates.chosen
      ? 'READING'
      : this.dates.proposed
        ? 'SUGGESTED'
        : 'BACKLOG';
});

BookSchema.virtual('averageRating').get(function() {
  return this.ratings && this.ratings.length > 0
    ? (this.ratings.reduce((sum, rating) => sum + rating.value, 0) / this.ratings.length)
    : -1;
});

BookSchema.methods.replaceRatingFromUser = async function({ user, value } : { user: string, value: number }) {
  const instance = this;

  instance.ratings = [
    ...instance.ratings.filter(_ => _.user.toString() !== user),
    {
      user,
      value,
    },
  ];

  return await instance.save();
};

const BookModel = mongoose.model('Book', BookSchema);

export {
  BookModel,
  BookSchema
};