const sql = require("./db.js");
const bcrypt = require('bcrypt')
// constructor
const Script = function(script) {
  this.user_id = script.user_id;
  this.script = script.script;
};

Script.create = (newScript, result) => {
  sql.query("INSERT INTO tbl_script SET ?", newScript, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newScript });
  });
};

Script.upsert = (newScript, result) => {
  console.log(newScript)
  sql.query(
    `INSERT INTO tbl_script (user_id, script) 
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE 
     script = VALUES(script)`,
    [newScript.user_id, newScript.script], 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId || newScript.id, ...newScript });
    }
  );
};


Script.findById = (id, result) => {
  sql.query(`SELECT * FROM tbl_script WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found script: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Script.findByUserId = (user_id, result) => {
  sql.query(`SELECT * FROM tbl_script WHERE user_id = ${user_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found script: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found script with the user_id
    result({ kind: "not_found" }, null);
  });
};


Script.getAll = (user_id, result) => {
  let query = "SELECT * FROM tbl_script";
  if (user_id) {
    query += ` WHERE user_id = '${user_id}'`;
  }
  console.log(query)

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Script.updateById = (id, script, result) => {
  sql.query(
    "UPDATE tbl_script SET name = ?, email = ? WHERE id = ?",
    [script.name, script.email, id],
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

      console.log("updated script: ", { id: id, ...script });
      result(null, { id: id, ...script });
    }
  );
};

Script.remove = (id, result) => {
  sql.query("DELETE FROM tbl_script WHERE id = ?", id, (err, res) => {
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

Script.removeAll = result => {
  sql.query("DELETE FROM tbl_script", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tutorials`);
    result(null, res);
  });
};

const checkIfExists = (userId, callback) => {
  const query = `
      SELECT COUNT(*) AS count
      FROM tbl_script
      WHERE user_id = ?
  `;
  
  sql.query(query, [userId], (err, result) => {
      if (err) {
          console.error("Error checking if user_id exists:", err);
          return callback(err, null);
      }
      
      const exists = result[0].count > 0;
      callback(null, exists);
  });
};

Script.upsertScript = (newScript, callback) => {
  checkIfExists(newScript.user_id, (err, exists) => {
      if (err) {
          return callback(err, null);
      }
      
      if (exists) {
          // Update if user_id exists
          const updateQuery = `
              UPDATE tbl_script
              SET script = ?
              WHERE user_id = ?
          `;
          
          sql.query(updateQuery, [newScript.script, newScript.user_id], (err, result) => {
              if (err) {
                  console.error("Error updating script:", err);
                  return callback(err, null);
              }
              
              callback(null, result);
          });
      } else {
          // Insert if user_id does not exist
          const insertQuery = `
              INSERT INTO tbl_script (user_id, script)
              VALUES (?, ?)
          `;
          
          sql.query(insertQuery, [newScript.user_id, newScript.script], (err, result) => {
              if (err) {
                  console.error("Error inserting script:", err);
                  return callback(err, null);
              }
              
              callback(null, result);
          });
      }
  });
};

module.exports = Script;
