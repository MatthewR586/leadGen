const Lead = require("../models/lead.model.js");

// Create and Save a new User (alternative method to register)
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const lead = new Lead({
    law_firm_name: req.body.law_firm_name,
    phone_number: req.body.phone_number,
    email: req.body.email,
    person_name: req.body.person_name,
    person_title: req.body.person_title,
    site: req.body.site,
    company_address: req.body.company_address,
    person_linkedin_url: req.body.person_linkedin_url,
    company_linkedin_url: req.body.company_linkedin_url,
    modifier: req.body.modifier,
    user_id: req.body.user_id,
    script_id: req.body.script_id,
  });

  // Save User in the database
  Lead.create(lead, (err, data) => {
    if (err)
      res.send({
        message: err.message || "Some error occurred while creating the User.",
        success: false
      });
    else res.send({message: data, success: true});
  });
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
  const userId = req.query.user;

  Lead.getAll(userId, (err, data) => {
    if (err)
      res.send({
        message: err.message || "Some error occurred while retrieving users.",
        success: false
      });
    else res.send({message: data, success: true});
  });
};

// Find a single User by Id
exports.findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Lead.updateById(
    req.params.id,
    new Lead(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.send({
            message: `Not found User with id ${req.params.id}.`,
            success: false
          });
        } else {
          res.send({
            message: "Error updating User with id " + req.params.id,
            success: false
          });
        }
      } else res.send({message: data, success: true});
    }
  );
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  console.log("req.params.id", req)
  Lead.remove(req.query.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found User with id ${req.params.id}.`,
          success: false
        });
      } else {
        res.send({
          message: "Could not delete User with id " + req.params.id,
          success: false
        });
      }
    } else res.send({ message: `User was deleted successfully!`, success: true });
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users."
      });
    else res.send({ message: `All Users were deleted successfully!` });
  });
};
