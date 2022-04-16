const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const authRouter = require('./routes/authRouter');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Started listening at port ${port}`);
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log(err);
  });
