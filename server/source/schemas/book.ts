import mongoose from 'lib/mongoose';

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

const BookModel = mongoose.model('Book', BookSchema);

export {
  BookModel,
  BookSchema
};