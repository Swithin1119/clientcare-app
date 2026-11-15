
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Client = require("./models/Client");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==============================
// MONGODB CONNECTION
// ==============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed:", error.message);
  });

// ==============================
// LOGIN
// ==============================

app.post("/api/login", (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password are required",
      });
    }

    const users = [
      {
        phone: process.env.USER1_PHONE,
        password: process.env.USER1_PASSWORD,
      },
      {
        phone: process.env.USER2_PHONE,
        password: process.env.USER2_PASSWORD,
      },
    ];

    const user = users.find(
      (item) =>
        item.phone === phone.trim() &&
        item.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// ==============================
// SERVER TEST
// ==============================

app.get("/", (req, res) => {
  res.json({
    message: "ClientCare Server is Running",
  });
});

// ==============================
// GET ALL CLIENTS
// ==============================

app.get("/api/clients", async (req, res) => {
  try {
    const clients = await Client.find().sort({
      createdAt: -1,
    });

    res.json(clients);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
});

// ==============================
// ADD NEW CLIENT
// ==============================

app.post("/api/clients", async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();

    res.status(201).json({
      message: "Client added successfully",
      client: savedClient,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add client",
      error: error.message,
    });
  }
});

// ==============================
// UPDATE CLIENT
// ==============================

app.put("/api/clients/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid client ID",
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update client",
      error: error.message,
    });
  }
});

// ==============================
// DELETE CLIENT
// ==============================

app.delete("/api/clients/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid client ID",
      });
    }

    const deletedClient = await Client.findByIdAndDelete(
      req.params.id
    );

    if (!deletedClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete client",
      error: error.message,
    });
  }
});

// ==============================
// START SERVER
// ==============================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
