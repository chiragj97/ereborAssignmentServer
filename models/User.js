const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  allowAccess: {
    type: Boolean,
    default: false,
  },
});

// userSchema.pre('save', function (next) {
//   const user = this;
//   if (user.isNew) {
//     function encryptPassword() {
//       return bcryptjs.genSalt(10).then(function (salt) {
//         return bcryptjs
//           .hash(user.password, salt)
//           .then(function (encryptedPassword) {
//             user.password = encryptedPassword;
//           });
//       });
//     }
//   }
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
