const sql = require("./db.js");
// constructor
const CallHistory = function (callHistory) {
    this.lead_id = callHistory.lead_id;
    this.call_id = callHistory.call_id;
    this.summary = callHistory.summary;
    this.length = callHistory.length;
    this.status = callHistory.status;
};

CallHistory.create = (newCallHistory, result) => {
    sql.query("INSERT INTO tbl_call_history SET ?", newCallHistory, (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }

        // console.log("created callHistory: ", { id: res.insertId, ...newCallHistory });
        result(null, { id: res.insertId, ...newCallHistory });
    });
};

CallHistory.findById = (id, result) => {
    sql.query(`SELECT * FROM tbl_call_history WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found callHistory: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
    });
};

CallHistory.getAll = (userId, result) => {
    let query = `SELECT 
                    ch.*,
                    l.law_firm_name,
                    l.phone_number,
                    l.email
                FROM 
                    tbl_call_history ch
                JOIN 
                    tbl_lead l ON ch.lead_id = l.id
                WHERE 
                    l.user_id = ?;`

    sql.query(query, [userId], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("leads: ", res);
        result(null, res);
    });
};

CallHistory.updateById = (id, callHistory, result) => {
    sql.query(
        "UPDATE tbl_call_history SET law_firm_name = ?, phone_number = ?, email = ?, person_name = ?, person_title = ?, site = ?, company_address = ?, person_linkedin_url = ?, company_linkedin_url = ?, modifier = ?, user_id = ? WHERE id = ?",
        [callHistory.law_firm_name, callHistory.phone_number, callHistory.email, callHistory.person_name, callHistory.person_title, callHistory.site, callHistory.company_address, callHistory.person_linkedin_url, callHistory.company_linkedin_url, callHistory.modifier, callHistory.user_id, id],
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

            console.log("updated callHistory: ", { id: id, ...callHistory });
            result(null, { id: id, ...callHistory });
        }
    );
};

CallHistory.remove = (id, result) => {
    sql.query("DELETE FROM tbl_call_history WHERE id = ?", id, (err, res) => {
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

CallHistory.removeAll = result => {
    sql.query("DELETE FROM tbl_call_history", (err, res) => {
        if (err) {
            result(null, err);
            return;
        }

        result(null, res);
    });
};

CallHistory.getCallHistoryByUserId = (userId, result) => {
    let query = `SELECT
    l.user_id,
    l.law_firm_name,
    l.phone_number,
    l.email,
    ch.id AS call_id,
    ch.lead_id,
    ch.call_id AS call_ref,
    ch.summary,
    ch.length,
    ch.status,
    ch.created_at,
    ch.updated_at
  FROM
    tbl_call_history ch
  JOIN
    tbl_lead l ON ch.lead_id = l.id
  WHERE
    l.user_id = ?;  
  `

    sql.query(query, [userId], (err, res) => {
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

        console.log("callHistory: ", res);
        result(null, res);
    })
}
CallHistory.findLeadIdByPhoneNumber = (phoneNumber, result) => {
    const cleanedPhoneNumber = phoneNumber.replace(/[()\s+-]/g, '').slice(1); // Remove spaces, parentheses, and plus signs
    const query = `
      SELECT id
      FROM tbl_lead
      WHERE REPLACE(REPLACE(REPLACE(REPLACE(phone_number, ' ', ''), '(', ''), ')', ''), '-', '') LIKE '%${cleanedPhoneNumber}%';
      `;

    sql.query(query, (err, res) => {
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
    })
}

module.exports = CallHistory;
