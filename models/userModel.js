const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    credentials: [
      {
        name: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        password: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    collection: 'pm-users',
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
