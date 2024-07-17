const Script = require("../models/script.model.js");

// Create and Save a new Script (alternative method to register)
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Script
  const script = new Script({
    user_id: req.query.user_id,
    script: req.body.script,
  });

  // Save Script in the database
  Script.create(script, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Script."
      });
    else res.send(data);
  });
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
  const user_id = req.query.user_id;
  
  Script.getAll(user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
        success: false
      });
    else res.send({message: data, success: true});
  });
};

// Find a single Script by Id
exports.findOne = (req, res) => {
  Script.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Script with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Script with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a Script identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  Script.updateById(
    req.params.id,
    new Script(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Script with id ${req.params.id}.`,
            success: false
          });
        } else {
          res.status(500).send({
            message: "Error updating Script with id " + req.params.id,
            success: false
          });
        }
      } else res.send({message: data, success: true});
    }
  );
};

// Delete a Script with the specified id in the request
exports.delete = (req, res) => {
  Script.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found Script with id ${req.params.id}.`,
          success: false
        });
      } else {
        res.send({
          message: "Could not delete Script with id " + req.params.id,
          success: false
        });
      }
    } else res.send({ message: `Script was deleted successfully!`, success: true });
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  Script.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users."
      });
    else res.send({ message: `All Users were deleted successfully!` });
  });
};

// Create and Save a new Script (alternative method to register)
exports.insert = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
      success: false
    });
    return;
  }

  // Create a Script
  const script = {
    user_id: req.body.user_id,
    title: req.body.title,
    script: req.body.script,
    sms: req.body.sms
  };
  // Save Script in the database with upsert
  Script.insert(script, (err, data) => {
    if (err) {
      res.send({
        message: err.message || "Some error occurred while creating the Script.",
        success: false
      });
    } else {
      res.send({message: data, success: true});
    }
  });
};