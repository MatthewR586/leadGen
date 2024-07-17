const express = require("express");
const cron = require('node-cron');
require('dotenv').config();
const https = require('https');
const crypto = require('node:crypto');
const axios = require('axios');
const cors = require("cors");
const { getCallHistoryByUserId, findLeadIdByPhoneNumber, create, removeAll } = require("./app/models/callHistory.model.js");
const { findUnCompletedLeads, updateCountById } = require("./app/models/lead.model.js");
const options = {
  hostname: 'api.bland.ai',
  path: '/v1/calls',
  method: 'GET',
  headers: {
    'authorization': process.env.BLAND_AUTH
  }
};

const app = express();

var corsOptions = {};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

require("./app/routes/routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


let oldBlandResponse = -1;
// cron.schedule('*/5 * * * * *', () => {
//   const req = https.request(options, (res) => {
//     let data = '';

//     res.on('data', (chunk) => {
//       data += chunk;
//     });

//     res.on('end', async () => {
//       blandResponse = JSON.parse(data);
//       console.log(blandResponse.calls)
//       if (blandResponse.count == oldBlandResponse ) return
//       oldBlandResponse = blandResponse.count
//       // console.log(Object.keys(blandRespons))
//       // console.log(blandRespons.calls.length)
//       blandResponse.calls.forEach(item => {
//         findLeadIdByPhoneNumber(item.to, (err, result) => {
//           if (result.length == 0) return
//           removeAll((err, removeResult) => {
//             if (err == null) {
//               // console.log(err, result)
//               create({
//                 lead_id: result[0].id,
//                 call_id: item.call_id,
//                 summary: item.summary,
//                 length: Math.ceil(item.call_length * 60),
//                 status: item.status,
//                 created_at: item.created_at
//               }, (err, result) => {
//                 // console.log(err, result)
//               })
//             }
//           })
//         });
//       });
//     });
//   });

//   req.on('error', (error) => {
//     console.error(error);
//   });

//   req.end();

// });

// cron.schedule('0 9 * * *', () => {
//   // cron.schedule('0 9 * * *', () => {
//   console.log('Running a job at 09:00 AM every day');
//   // Find all leads call count less than 5 and result is no
//   findUnCompletedLeads((err, res) => {
//     console.log(err, res.length)
//     if (err == null) {
//       res.forEach(lead => {
//         console.log(lead.script)

//         const headers = {
//           'Authorization': process.env.BLAND_AUTH
//         };
//         // Data
//         const data = {
//           "phone_number": "+1" + lead.phone_number,
//           "from": null,
//           "task": `${lead.script} \n replace [Law Firm Name] to ${lead.law_firm_name}, [Contact Name] to ${lead.person_name}, [your website URL] to ${lead.site}, [Main Problem] to ${lead.modifier}`,
//           "model": "enhanced",
//           "language": "en",
//           "voice": "nat",
//           "voice_settings": {},
//           "local_dialing": false,
//           "max_duration": 12,
//           "answered_by_enabled": false,
//           "wait_for_greeting": false,
//           "record": false,
//           "amd": false,
//           "interruption_threshold": 100,
//           "voicemail_message": null,
//           "temperature": null,
//           "transfer_list": {},
//           "metadata": {},
//           "pronunciation_guide": [],
//           "start_time": null,
//           "request_data": {},
//           "tools": [],
//           "webhook": null,
//           "calendly": {}
//         }

//         //  API request
//         axios.post('https://api.bland.ai/v1/calls', data, { headers }).then(response => {
//           console.log(response)
//           if(response.data.status == 'success') {
//               updateCountById(lead.id, (err, result) => {
//             })
//           }
//         }).catch(error => {
//           console.log(error)
//         });
//       });
//     } else {
//       console.log("error is ", err)
//     }
//   })
// });

