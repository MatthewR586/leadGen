const sql = require("./db.js");
const bcrypt = require('bcrypt')
// constructor
const Schedule = function(schedule) {
  this.user_id = schedule.user_id;
  this.lead_id = schedule.lead_id;
  this.title = schedule.title;
  this.script_id = schedule.script_id;
  this.date = schedule.date;
  this.status = schedule.status;
};

Schedule.create = (newSchedule, result) => {
  sql.query("INSERT INTO tbl_schedules SET ?", newSchedule, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newSchedule });
  });
};

Schedule.upsert = (newSchedule, result) => {
  console.log(newSchedule)
  sql.query(
    `INSERT INTO tbl_schedules (user_id, title, schedule) 
     VALUES (?, ?, ?)`,
    [newSchedule.user_id, newSchedule.title, newSchedule.schedule], 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      result(null, { id: res.insertId, ...newSchedule });
    }
  );
};

Schedule.insert = (newSchedule, result) => {
  console.log({newSchedule})
  sql.query(
    `INSERT INTO tbl_schedules (user_id, title, schedule) 
     VALUES (?, ?, ?)`,
    [newSchedule.user_id, newSchedule.title, newSchedule.schedule], 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      result(null, { id: res.insertId, ...newSchedule });
    }
  );
};


Schedule.findById = (id, result) => {
  sql.query(`SELECT * FROM tbl_schedules WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found schedule: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Schedule.findByUserId = (user_id, result) => {
  sql.query(`SELECT * FROM tbl_schedules WHERE user_id = ${user_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found schedule: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found schedule with the user_id
    result({ kind: "not_found" }, null);
  });
};


Schedule.getAll = (user_id, result) => {
  let query = "SELECT sch.title, sch.date,  COUNT(DISTINCT l.id) AS leads_count, GROUP_CONCAT(DISTINCT s.title ORDER BY s.title SEPARATOR ', ') AS script_title FROM tbl_schedules sch LEFT JOIN  tbl_lead l ON sch.lead_id = l.id LEFT JOIN tbl_script s ON sch.script_id = s.id WHERE sch.user_id = ? GROUP BY sch.title;";
  
  sql.query(query, [user_id], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Schedule.updateById = (id, schedule, result) => {
  sql.query(
    "UPDATE tbl_schedules SET schedule = ?, title = ? WHERE id = ?",
    [schedule.schedule, schedule.title, id],
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

      console.log("updated schedule: ", { id: id, ...schedule });
      result(null, { id: id, ...schedule });
    }
  );
};
Schedule.updateStatusById = (id, status, result) => {
  sql.query(
    "UPDATE tbl_schedules SET status = ? WHERE id = ?",
    [status, id],
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

      console.log("updated schedule: ", { id: id });
      result(null, { id: id });
    }
  );
};
Schedule.remove = (title, result) => {
  sql.query("DELETE FROM tbl_schedules WHERE title = ?", title, (err, res) => {
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

    result(null, res);
  });
};

Schedule.removeAll = result => {
  sql.query("DELETE FROM tbl_schedules", (err, res) => {
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
      FROM tbl_schedules
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

Schedule.upsertScript = (newSchedule, callback) => {
  checkIfExists(newSchedule.user_id, (err, exists) => {
      if (err) {
          return callback(err, null);
      }
      
      if (exists) {
          // Update if user_id exists
          const updateQuery = `
              UPDATE tbl_schedules
              SET schedule = ?
              WHERE user_id = ?
          `;
          
          sql.query(updateQuery, [newSchedule.schedule, newSchedule.user_id], (err, result) => {
              if (err) {
                  console.error("Error updating schedule:", err);
                  return callback(err, null);
              }
              
              callback(null, result);
          });
      } else {
          // Insert if user_id does not exist
          const insertQuery = `
              INSERT INTO tbl_schedules (user_id, schedule)
              VALUES (?, ?)
          `;
          
          sql.query(insertQuery, [newSchedule.user_id, newSchedule.schedule], (err, result) => {
              if (err) {
                  console.error("Error inserting schedule:", err);
                  return callback(err, null);
              }
              
              callback(null, result);
          });
      }
  });
};

Schedule.getDetail = (title, user_id, result) => {
  let query =  `SELECT 	tbl_schedules.*,
	tbl_lead.law_firm_name,
	tbl_lead.phone_number,
	tbl_lead.email,
	tbl_lead.person_name,
	tbl_lead.person_title,
	tbl_lead.site,
	tbl_lead.company_address,
	tbl_lead.person_linkedin_url,
	tbl_lead.company_linkedin_url,
	tbl_lead.modifier,
	tbl_lead.count,
	tbl_lead.is_success  FROM tbl_schedules LEFT JOIN tbl_lead ON tbl_schedules.lead_id = tbl_lead.id WHERE	title = ? AND tbl_schedules.user_id = ?`;
  sql.query(query, [title, user_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found schedule: ", res);
      result(null, res);
      return;
    }

    // not found schedule with the user_id
    result({ kind: "not_found" }, null);
  });
}

Schedule.getSchedules = (result) => {
  let query = `select tbl_schedules.*, tbl_lead.law_firm_name, tbl_lead.person_name, tbl_lead.site, tbl_lead.modifier, tbl_lead.phone_number, tbl_script.script  from tbl_schedules LEFT JOIN tbl_lead on tbl_lead.id = tbl_schedules.lead_id LEFT JOIN tbl_script on tbl_script.id = tbl_schedules.script_id`;
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found schedule: ", res);
      result(null, res);
      return;
    }

    // not found schedule with the user_id
    result({ kind: "not_found" }, null);
  });
}


module.exports = Schedule;
