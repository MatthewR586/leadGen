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
import React, { useEffect, useState, useMemo } from "react";

import { Button, Card, Col, Input, Row, Space, Table, notification } from "antd";
import { backend_api } from "../config";
import axios from "axios";
import { render } from "@testing-library/react";
import {SearchOutlined} from "@ant-design/icons"
const Context = React.createContext({
  name: 'Default',
});

function Home() {
  const [patientData, setPatientData] = useState([]);
  const [lawFirmData, setLawFirmData] = useState([]);
  const [patientDataLoading, setPatientDataLoading] = useState(false);
  const [lawFirmDataLoading, setLawFirmDataLoading] = useState(false);
  const [searchLawFirm, setSearchLawFirm] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [filteredPatientData, setFilteredPatientData] = useState([])
  const [filteredLawFirmData, setFilteredLawFirmData] = useState([])
  const [callButtonLoading, setCallButtonLoading] = useState()
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {

    axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Qn5nABYDjLb73ZyD3cgqA68rp-wsw601TmwQLtztyQGRcQV1bI6WBV2IA0m9Utns3GdBFLql1Rj2/pub?gid=0&single=true&output=csv').then((response) => {
      if(response.status == 200) {
        let parsingData= parseCSV(response.data)  
        setLawFirmData(parsingData)        
        setFilteredLawFirmData(parsingData)
      }
    })

  }, [])
  
  const parseCSV = (csvText) => {
    const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
    const headers = rows[0].replace(/\s+/g, '').split(',').filter(item => item !== ""); // Extract headers (assumes the first row is the header row)
    const data = []; // Initialize an array to store parsed data
    for (let i = 1; i < rows.length; i++) {
      const modifiedText = rows[i].replace(/("[^"]*")|,/g, (match, group1) => {
        // If match is within double quotes, return it unchanged
        if (group1) {
          return group1;
        } else {
          // Replace comma outside of quotes with @@@
          return '@@@';
        }
      });
      
      // Replace remaining commas with @@@
        const rowData = modifiedText.split('@@@'); // Split the row, handling '\r' characters
        const rowObject = {};
        for (let j = 0; j < headers.length; j++) {
            rowObject[headers[j]] = rowData[j];
        }
        data.push(rowObject);
    }
    return data;
  }

  const handleSearchLawFirmChange = (e) => {
    setLawFirmDataLoading(true)
    setSearchLawFirm(e.target.value)
    const searchKey = e.target.value
    filterDataAsync(lawFirmData, searchKey).then(filteredData => {
      setFilteredLawFirmData(filteredData)  
      setLawFirmDataLoading(false)
    })
  }

  const filterDataAsync = (data, key) => {
    return new Promise((resolve) => {
      const filteredData = data.filter(item => 
        item.FirmsName?.toLowerCase().includes(key.toLowerCase()) || 
        item.PhoneNumber?.toLowerCase().includes(key.toLowerCase()) || 
        item.Email?.toLowerCase().includes(key.toLowerCase()) || 
        item.PersonName?.toLowerCase().includes(key.toLowerCase()) ||
        item.Title?.toLowerCase().includes(key.toLowerCase())
      );
      resolve(filteredData);
    });
  }
  
  const handleCallButton = (record) => {
    let contact_name = record.PersonName
    let law_firm_name = record.FirmsName
    let task = `
    AI: "Hello, this is Sally calling on behalf of Smoomer AI. Am I speaking with ${contact_name}, the decision-maker for legal technology at ${law_firm_name}?"
    
    [Wait for response]
    
    If Yes:
    AI: "Great! I'm reaching out because we've developed an automation solution that's helping law firms save over 20 hours a week on administrative tasks. Do you have a moment to discuss how this might benefit your firm?"
    
    
    
    If No:
    AI: "I understand. Could you please direct me to the person who handles decisions about legal technology and efficiency improvements in your firm?"
    
    
    
    Main Pitch:
    AI: "Our advanced automation tools streamline tasks like appointment scheduling, document management, and email communications. This allows your team to focus more on client work and less on administrative duties. Many firms we work with see significant improvements in efficiency and client satisfaction. Would you be interested in learning how this could work specifically for your firm?"
    
    [Wait for response]
    
    If Interested:
    AI: "Excellent! I'd love to set up a more detailed demonstration with our team. We can show you exactly how our automation adapts to your firm's unique needs. What's the best way to schedule this? I can send a calendar invite right away."
    
    If Not Interested:
    AI: "I appreciate your time. May I ask what solutions you're currently using for task automation in your firm?"
    
    [Wait for response]
    
    AI: "Thank you for sharing that. If it's alright with you, I'd like to send some information about how our solution compares to doing it yourself with Zapier. This way, you'll have it on hand if your needs change in the future. Could I get the best email to send this to?"
    
    
    
    Closing:
    AI: "Thank you for your time today, ${contact_name}. If you have any questions or if your automation needs change, please don't hesitate to reach out. Have a great day!"
    
    `
    
    

    const headers = {
      'Authorization': process.env.REACT_APP_BLAND_AUTH
   };
   
   record.PhoneNumber = '(727) 346-6423'

   // Data
   const data = {
     "phone_number": "+1" + record.PhoneNumber,
     "from": null,
     "task": task,
     "model": "enhanced",
     "language": "en",
     "voice": "nat",
     "voice_settings": {},
     "local_dialing": false,
     "max_duration": 12,
     "answered_by_enabled": false,
     "wait_for_greeting": false,
     "record": false,
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
   
  //  API request
   axios.post('https://api.bland.ai/v1/calls', data, {headers}).then(response => {
    console.log(response)
    notification.success({message: 'Successfully Sent', description: 'Call sent successfully'})
   }).catch(error => {
    console.log(error)
    notification.error({message: 'Error', description: 'Error Occured'})

   });
   
  }

  const law_firm_columns = [
   
    {
      title: "Law firm name",
      dataIndex: "FirmsName",
      key: "FirmsName",
      render(data) {
        return (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {data}
          </div>
        )
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Phone Number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
       render(data) {
        return (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {data}
          </div>
        )
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Person",
      dataIndex: "PersonName",
      key: "PersonName",
      render(data) {
        return (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {data}
          </div>
        )
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      render(data) {
        return (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {data}
          </div>
        )
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Website",
      dataIndex: "Website",
      key: "Website",
      render: (link) => {
        return <div style={{ whiteSpace: 'pre-wrap', width: '50px' }}><a href={link} target="_blank" style={{ whiteSpace: 'pre-wrap' }}>Visit</a></div>
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "50px",
    },
    {
      title: "Company",
      dataIndex: "CompanyLinkedin",
      key: "CompanyLinkedin",
      render: (link) => {
        return <div style={{ whiteSpace: 'pre-wrap', width: '50px' }}><a href={link} target="_blank" style={{ whiteSpace: 'pre-wrap' }}>Visit</a></div>
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "50px",
    },
    {
      title: "Personal",
      dataIndex: "PersonLinkedinURL",
      key: "PersonLinkedinURL",
      render: (link) => {
        return <div style={{ whiteSpace: 'pre-wrap', width: '50px' }}><a href={link} target="_blank" style={{ whiteSpace: 'pre-wrap' }}>Visit</a></div>
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "50px",
    },
    
    {
      title: "Call",
      render(_, record) {
        return (
          <div>
            <Button type="primary" onClick={(e) => handleCallButton(record)}>Call</Button>
          </div>
        )
      }
    },
  ];

  const contextValue = useMemo(
    () => ({
      name: 'Ant Design',
    }),
    [],
  );


  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Leads">
              <Row justify="end">
                <Col md={6}>
                  <Input prefix={<SearchOutlined />} size="small" placeholder="Search" value={searchLawFirm} onChange={(e) => handleSearchLawFirmChange(e)}/>
                </Col>
              </Row>
              <Table
                columns={law_firm_columns}
                dataSource={filteredLawFirmData}
                scroll={{ x: true }}
                rowKey={(record) => record.id}
                loading={!lawFirmData.length || lawFirmDataLoading}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
        
      </div>
    </Context.Provider>
  );
}

export default Home;
