const mongoose = require("mongoose");

// =====================================
// CLIENT SCHEMA
// =====================================

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phc: {
      type: String,
      required: true,
      trim: true,
    },

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    treatment: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================
// EXPORT MODEL
// =====================================

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;