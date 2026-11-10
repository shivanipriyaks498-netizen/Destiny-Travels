
import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    country: {
      type: String,
      required: true,
      trim: true
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Beach",
        "Hill Station",
        "Adventure",
        "Historical",
        "Nature",
        "Religious"
      ]
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    imageUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Destination = mongoose.model(
  "Destination",
  destinationSchema
);

export default Destination;
