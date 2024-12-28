import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  title: String,
  id: Number,
});

export default ExampleSchema;
