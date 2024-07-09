const { verifyWebhookSignature } = require("../utility/index.js");

module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const leads = require("../controllers/lead.controller.js");
  const callHistory = require("../controllers/call.contoller.js");
  const scriptHistory = require("../controllers/script.controller.js");
  var router = require("express").Router();

  // user management
  router.post("/register", users.register)
  router.post("/login", users.login)

  // lead management
  router.post("/lead", leads.create)
  router.get("/lead", leads.findAll)
  router.delete("/lead", leads.delete)
  router.put("/lead/:id", leads.update)
  
  // call log
  router.get('/call_log', callHistory.findAll)

  // script
  router.get('/script', scriptHistory.findAll)
  router.post('/script', scriptHistory.insert)
  router.put('/script/:id', scriptHistory.update)
  router.delete('/script/:id', scriptHistory.delete)

  app.use('/api', router);
};
