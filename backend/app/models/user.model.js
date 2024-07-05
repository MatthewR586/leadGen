const sql = require("./db.js");
const bcrypt = require('bcrypt')
// constructor
const User = function(user) {
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
};


// Register a new user
User.register = (newUser, result) => {
  // Check if the user already exists
  sql.query("SELECT * FROM tbl_user WHERE email = ?", [newUser.email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // User already exists
      result({ kind: "user_exists" }, null);
      return;
    }

    // Hash the password before saving
    bcrypt.hash(newUser.password, 10, (err, hash) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      newUser.password = hash;

      // Save the new user
      sql.query("INSERT INTO tbl_user SET ?", newUser, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created user: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
      });
    });
  });
};

// Login method
User.login = (email, password, result) => {
  sql.query("SELECT * FROM tbl_user WHERE email = ?", [email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      const user = res[0];

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (isMatch) {
          console.log("login successful: ", user);
          result(null, user);
        } else {
          // Passwords don't match
          result({ kind: "invalid_password" }, null);
        }
      });
    } else {
      // User not found
      result({ kind: "not_found" }, null);
    }
  });
};



User.create = (newUser, result) => {
  sql.query("INSERT INTO tbl_user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created tutorial: ", { id: res.insertId, ...newUser});
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findById = (id, result) => {
  sql.query(`SELECT * FROM tbl_user WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = (name, result) => {
  let query = "SELECT * FROM tbl_user";

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE tbl_user SET name = ?, email = ? WHERE id = ?",
    [user.name, user.email, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM tbl_user WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted tutorial with id: ", id);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM tbl_user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tutorials`);
    result(null, res);
  });
};

module.exports = User;
