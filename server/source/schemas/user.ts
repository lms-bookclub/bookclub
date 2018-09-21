import mongoose from 'lib/mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  avatar: {
    type: String,
  },

  googleId: {
    type: String,
  },

  suggestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],

  dates: {
    created: {
      type: Date,
      required: true,
    },
  },

  roles: [{
    type: String,
    enum: ['MEMBER', 'ADMIN'],
    default: 'MEMBER',
  }],
});

UserSchema.statics.findOrCreate = async function(profile) {
  const Model = this;
  try {
    let user = await Model.findOne({
      googleId: profile.id,
    });

    if(user) {
      return user;
    }

    user = await Model.create({
      name: profile.name.givenName + ' ' + profile.name.familyName,
      googleId: profile.id,
      avatar: profile._json && profile._json.image && profile._json.image.url,
      dates: {
        created: new Date().getTime(),
      },
    });

    return user;
  } catch(err) {
    console.log('Error in findOrCreate', err);
    throw err;
  }
};

const UserModel = mongoose.model('User', UserSchema);

export {
  UserModel,
  UserSchema
};