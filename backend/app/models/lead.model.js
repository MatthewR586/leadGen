const sql = require("./db.js");
const bcrypt = require('bcrypt')
// constructor
const Lead = function(lead) {
  this.law_firm_name = lead.law_firm_name;
  this.phone_number = lead.phone_number;
  this.email = lead.email;
  this.person_name = lead.person_name;
  this.person_title = lead.person_title;
  this.site = lead.site;
  this.company_address = lead.company_address;
  this.person_linkedin_url = lead.person_linkedin_url;
  this.company_linkedin_url = lead.company_linkedin_url;
  this.modifier = lead.modifier;
  this.user_id = lead.user_id;
  this.script_id = lead.script_id;
};

Lead.create = (newLead, result) => {
  console.log({newLead})
  sql.query("INSERT INTO tbl_lead SET ?", newLead, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created lead: ", { id: res.insertId, ...newLead});
    result(null, { id: res.insertId, ...newLead });
  });
};

Lead.findById = (id, result) => {
  sql.query(`SELECT * FROM tbl_lead WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found lead: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Lead.getAll = (leadId, result) => {
  let query = "SELECT * FROM tbl_lead";

  if (leadId) {
    query += ` WHERE user_id = ${leadId}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("leads: ", res);
    result(null, res);
  });
};

Lead.updateById = (id, lead, result) => {
  console.log({lead})
  sql.query(
    "UPDATE tbl_lead SET law_firm_name = ?, phone_number = ?, email = ?, person_name = ?, person_title = ?, site = ?, company_address = ?, person_linkedin_url = ?, company_linkedin_url = ?, modifier = ?, user_id = ?, script_id = ? WHERE id = ?",
    [lead.law_firm_name, lead.phone_number, lead.email, lead.person_name, lead.person_title, lead.site, lead.company_address, lead.person_linkedin_url, lead.company_linkedin_url, lead.modifier,lead.user_id, lead.script_id, id],
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

      console.log("updated lead: ", { id: id, ...lead });
      result(null, { id: id, ...lead });
    }
  );
};

Lead.updateCountById = (id, result) => {
  sql.query(
    "UPDATE tbl_lead SET count = count + 1 WHERE id = ?",
    [id],
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

      result(null, { id: id});
    }
  );
};


Lead.remove = (id, result) => {
  sql.query("DELETE FROM tbl_lead WHERE id = ?", id, (err, res) => {
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

Lead.removeAll = result => {
  sql.query("DELETE FROM tbl_lead", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tutorials`);
    result(null, res);
  });
};

Lead.findUnCompletedLeads = (result) => {
  sql.query("SELECT lead.*, script.script FROM tbl_lead AS lead LEFT JOIN tbl_script AS script ON lead.user_id = script.user_id WHERE lead.count < 5 AND lead.is_success = 0", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
}

module.exports = Lead;
