/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { render } from "@testing-library/react";
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  Input,
  Tag,
  Space,
} from "antd";
import axios from "axios";

const call_history_columns = [
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Phone Number",
    dataIndex: "to",
    key: "to",
  },
  {
    title: "Call Length",
    dataIndex: "call_length",
    key: "call_length",
    render: (call_length) => {
      return <div>{Math.ceil(call_length * 60)}s</div>;
    },
  },

  {
    title: "Details",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>View</a>
      </Space>
    ),
  },
];

const call_history_data = [];

function Incoming() {
  const sendCall = async () => {
    // Headers
    const headers = {
      'Authorization': process.env.REACT_APP_BLAND_AUTH
   };
   
   // Data
   const data = {
     "phone_number": "+16095420502",
     "from": null,
      "task": "Note:There are two ways to upload this information into Zoho CRM. The first way is to manually\nenter it. The second way is to record the conversation and then information is uploaded\nautomatically. Please name the file “History Intake - Date - First Name, Last Name, Date of birth,\nDate of Injury’\n1. Would you like to speak English, Spanish or another language?\n2. What is your name?\n3. How old are you?\n4. Was this a car accident, slip and fall accident, or another kind of accident?\n5. What was the date of the accident?\n6. What body part is hurting you the most today?\n7. What is your current pain level rated on a scale of 0 to 10?\n8. What can you not do because of the pain?\n9. What are your goals in terms of pain relief? For example, go to the gym, play with\nyour dog, work without pain etc.\n10. Is it on the left, the right, more to the left, more to the right, in the middle, or on\nboth sides equally?\n11. How would you describe the pain?\n12.What makes it worse?\n13.What makes it better?\n14.Does the pain radiate? If so, where?\n15.Do you have any numbness and tingling? If so, where?\n16.What other body parts are hurting today?\na. Then ask again questions from #7-15\n17.Have you had a previous work accident for this body part?\n18.Have you had a previous accident for this body part?\n19.If so, did you have any injections, surgery, physical therapy, or chiropractic care?\n20.What is your occupation or job?\n21.Have you missed work because of this pain?\n22.If so, how many days have you missed?\n23.Have you attended physical therapy or seen a chiropractor?\n24. If so, what was the name of the physical therapist or chiropractor?\nApproximately how many times did you go?\n25.Have you used ice, stretching, anti-inflammatories, muscle relaxants, opioids,\npatches, creams, or CBD?\n26.What allergies do you have?\n27.What other medical conditions do you have?\n28.What medications do you take?\n29.What surgeries have you had?\n30.If so, what were the years of the surgeries?\n31.Have you ever had any injections to your shoulder, hip, or knee?\n32.Have you ever had any injections in your spine?\n33.If you have had injections, what facility or clinic were they done at?\n34.If you have had any injections, when were they done?\n35.Do you smoke or use tobacco?\n36. Do you drink alcohol? If so, how often?\n37.Do you use any illegal illicit or street drugs?\n38.What is the name and location of the pharmacy you use? What city is the\npharmacy in?\n39.What is your email address?\n40.What is your cell phone?",
     "model": "enhanced",
     "language": "en",
     "voice": "maya",
     "voice_settings": {},
     "local_dialing": false,
     "max_duration": 12,
     "answered_by_enabled": false,
     "wait_for_greeting": false,
     "record": true,
     "amd": false,
     "interruption_threshold": 100,
     "voicemail_message": null,
     "temperature": null,
     "transfer_list": {},
     "metadata": {},
     "pronunciation_guide": [],
     "start_time": null,
     "request_data": {},
     "tools": [],
     "webhook": null,
     "calendly": {}
   }
   
   // API request
   axios.post('https://api.bland.ai/v1/calls', data, {headers}).then((response) => {
    console.log("response", response.data)
    if(response.data.status == "success") 
      {
        let requestData = {
          goal: ""
        }
        axios.post("https://api.bland.ai/v1/calls/d403b948-27cd-4bed-afe5-a1783684e999/analyze",)
      } else {

      }
   }).catch(error => {
    console.log("error", error)
   });
  };

  return (
    <>
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Outcoming Call history">
              <Table
                columns={call_history_columns}
                dataSource={call_history_data}
              />
            </Card>
            <Button onClick={sendCall}>Send Call</Button>
          </Col>
        </Row>
       
      </div>
    </>
  );
}

export default Incoming;
