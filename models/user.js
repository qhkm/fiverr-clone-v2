 const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  name: String,
  password: String,
  photo: String,
  about: String,
  gigs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Gig'
    }
  ],
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Gig'
    }
  ]
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) 
    return next();
  if (user.password) {
    bcrypt
      .genSalt(10, function (err, salt) {
        if (err) 
          return next(err);
        bcrypt
          .hash(user.password, salt, null, function (err, hash) {
            if (err) 
              return next(err);
            user.password = hash;
            next(err);
          });
      });
  }
});

UserSchema.methods.comparePassword = function (password) {

  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function (size) {
  if (!size) 
    size = 200;
  if (!this.email) 
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', UserSchema);
