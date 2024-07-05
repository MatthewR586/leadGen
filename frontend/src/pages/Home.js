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

import { Button, Card, Col, Input, Row, Space, Table, notification, Form, Modal } from "antd";
import { backend_api } from "../config";
import axios from "axios";
import { render } from "@testing-library/react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import TextArea from "antd/lib/input/TextArea";

const Context = React.createContext({
  name: 'Default',
});

function Home() {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [lawFirmData, setLawFirmData] = useState([]);
  const [lawFirmDataLoading, setLawFirmDataLoading] = useState(false);
  const [searchLawFirm, setSearchLawFirm] = useState('');
  const [filteredLawFirmData, setFilteredLawFirmData] = useState([]);
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [law_firm_name, setLawFirmName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [personName, setPersonName] = useState('')
  const [api, contextHolder] = notification.useNotification();
  const [modifier, setModifier] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [personLinkedinUrl, setPersonLinkedinUrl] = useState('')
  const [companyLinkedinUrl, setCompanyLinkedinUrl] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [title, setTitle] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [deleteLeadModalOpen, setDeleteLeadModalOpen] = useState('')
  const [currentSelectedLead, setCurrentSelectedLead] = useState([])
  useEffect(() => {
    if (user == null) {
      history.push("/")
      return
    }
    // axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Qn5nABYDjLb73ZyD3cgqA68rp-wsw601TmwQLtztyQGRcQV1bI6WBV2IA0m9Utns3GdBFLql1Rj2/pub?gid=0&single=true&output=csv').then((response) => {
    //   if(response.status == 200) {
    //     let parsingData= parseCSV(response.data)  
    //     setLawFirmData(parsingData)        
    //     setFilteredLawFirmData(parsingData)
    //   }
    // })

    getLeads()
  }, [])

  const getLeads = () => {
    axios.get(`${backend_api}/lead?user=${user.id}`).then(response => {
      if (response.status == 200) {
        console.log(response.data)
        if (response.data.success) {
          setLawFirmData(response.data.message)
          setFilteredLawFirmData(response.data.message)
        } else {
          notification.error({ message: 'Error', description: response.data.message });
        }
      } else {
        notification.error({ message: 'Error', description: 'Server Error' });
      }
    }).catch(error => {
      notification.error({ message: 'Error', description: 'Server Error' });
    }).finally(() => {
      setIsLoading(false);
      setNewLeadModalOpen(false)
    })
  }

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

  const clearLeadForm = () => {
    setLawFirmName("")
    setEmail("")
    setCompanyAddress("")
    setCompanyLinkedinUrl("")
    setPersonLinkedinUrl("")
    setPhoneNumber("")
    setPersonName("")
    setTitle("")
    setSiteUrl("")
    setModifier("")
  }

  const handleCancel = () => {
    setNewLeadModalOpen(false)
    setDeleteLeadModalOpen(false)
    clearLeadForm()
  }

  const handleSaveNewLead = () => {
    const request = {
      law_firm_name: law_firm_name,
      phone_number: phoneNumber,
      email: email,
      person_name: personName,
      person_title: title,
      site: siteUrl,
      company_address: companyAddress,
      person_linkedin_url: personLinkedinUrl,
      company_linkedin_url: companyLinkedinUrl,
      modifier: modifier,
      user_id: user.id
    }
    setIsLoading(true)
    if (modalTitle == "Add New Lead") {
      axios.post(`${backend_api}/lead`, request).then(response => {
        if (response.status == 200) {
          console.log(response.data)
          if (response.data.success) {
            notification.success({ message: 'Success', description: 'Successfully Created' });
            getLeads()
          } else {
            notification.error({ message: 'Error', description: response.data.message });
          }
        } else {
          notification.error({ message: 'Error', description: 'Server Error' });
        }
      }).catch(error => {
        notification.error({ message: 'Error', description: 'Server Error' });
      }).finally(() => {
        setIsLoading(false);
        setNewLeadModalOpen(false)
        clearLeadForm()
      })
    } else {
      console.log(currentSelectedLead)
      axios.put(`${backend_api}/lead/${currentSelectedLead.id}`, request).then(response => {
        if (response.status == 200) {
          console.log(response.data)
          if (response.data.success) {
            notification.success({ message: 'Success', description: 'Successfully Updated' });
            getLeads()
          } else {
            notification.error({ message: 'Error', description: response.data.message });
          }
        } else {
          notification.error({ message: 'Error', description: 'Server Error' });
        }
      }).catch(error => {
        notification.error({ message: 'Error', description: 'Server Error' });
      }).finally(() => {
        setIsLoading(false);
        setNewLeadModalOpen(false)
        clearLeadForm()
      })
    }

  }

  const handleSearchLawFirmChange = (e) => {
    setSearchLawFirm(e.target.value)
    const searchKey = e.target.value
    filterDataAsync(lawFirmData, searchKey).then(filteredData => {
      setFilteredLawFirmData(filteredData)
    })
  }

  const filterDataAsync = (data, key) => {
    return new Promise((resolve) => {
      const filteredData = data.filter(item =>
        item.law_firm_name?.toLowerCase().includes(key.toLowerCase()) ||
        item.phone_number?.toLowerCase().includes(key.toLowerCase()) ||
        item.email?.toLowerCase().includes(key.toLowerCase()) ||
        item.person_name?.toLowerCase().includes(key.toLowerCase()) ||
        item.person_title?.toLowerCase().includes(key.toLowerCase())
      );
      resolve(filteredData);
    });
  }

  const handleDetailButton = (lead) => {
    setModalTitle("Detail Lead")
    console.log("lead", lead)
    setCurrentSelectedLead(lead)
    setLawFirmName(lead.law_firm_name)
    setEmail(lead.email)
    setCompanyAddress(lead.company_address)
    setCompanyLinkedinUrl(lead.company_linkedin_url)
    setPersonLinkedinUrl(lead.person_linkedin_url)
    setPhoneNumber(lead.phone_number)
    setPersonName(lead.person_name)
    setTitle(lead.person_title)
    setSiteUrl(lead.site)
    setModifier(lead.modifier)
    setNewLeadModalOpen(true)
  }

  const handleDeleteButton = (record) => {
    setDeleteLeadModalOpen(true)
    setCurrentSelectedLead(record)
  }

  const handleDeleteLead = () => {
    axios.delete(`${backend_api}/lead?id=${currentSelectedLead.id}`).then(response => {
      if (response.status == 200) {
        if (response.data.success) {
          notification.success({ message: 'Success', description: 'Lead deleted' })
          getLeads()
        } else {
          notification.error({ message: 'Error', description: response.data.message });
        }
      } else {
        notification.error({ message: 'Error', description: 'Server Error' });
      }
    }).catch(error => {
      notification.error({ message: 'Error', description: 'Server Error' });
    }).finally(() => {
      setIsLoading(false);
      setDeleteLeadModalOpen(false)
    })
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
    axios.post('https://api.bland.ai/v1/calls', data, { headers }).then(response => {
      console.log(response)
      notification.success({ message: 'Successfully Sent', description: 'Call sent successfully' })
    }).catch(error => {
      console.log(error)
      notification.error({ message: 'Error', description: 'Error Occured' })

    });

  }


  const law_firm_columns = [

    {
      title: "Law firm name",
      dataIndex: "law_firm_name",
      key: "law_firm_name",
      render(data) {
        return (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {data}
          </div>
        )
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "200px",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      width: "100px",

    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      dataIndex: "person_name",
      key: "person_name",
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
      dataIndex: "person_title",
      key: "person_title",
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
      title: "Try Count",
      dataIndex: "count",
      key: "count",
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
      dataIndex: "site",
      key: "site",
      render: (link) => {
        return <div style={{ whiteSpace: 'pre-wrap', width: '50px' }}><a href={link} target="_blank" style={{ whiteSpace: 'pre-wrap' }}>Visit</a></div>
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "50px",
    },
    {
      title: "Company",
      dataIndex: "person_linkedin_url",
      key: "person_linkedin_url",
      render: (link) => {
        return <div style={{ whiteSpace: 'pre-wrap', width: '50px' }}><a href={link} target="_blank" style={{ whiteSpace: 'pre-wrap' }}>Visit</a></div>
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "50px",
    },
    {
      title: "Personal",
      dataIndex: "person_linkedin_url",
      key: "person_linkedin_url",
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

    {
      title: "View",
      render(_, record) {
        return (
          <div>
            <Button type="link" onClick={(e) => handleDetailButton(record)}>Detail</Button>
          </div>
        )
      }
    },
    {
      title: "Delete",
      render(_, record) {
        return (
          <div>
            <Button type="link" danger onClick={(e) => handleDeleteButton(record)}>Delete</Button>
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
              <Row justify="space-between">
                <Col md={6}>
                  <Button type="primary" onClick={() => {
                    setNewLeadModalOpen(true)
                    setModalTitle("Add New Lead")
                  }}><PlusOutlined /> Add New</Button>
                </Col>
                <Col md={6}>
                  <Input prefix={<SearchOutlined />} size="small" placeholder="Search" value={searchLawFirm} onChange={(e) => handleSearchLawFirmChange(e)} />
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
        <Modal title={modalTitle} visible={newLeadModalOpen} onOk={handleSaveNewLead} confirmLoading={isLoading} onCancel={handleCancel} width={1000}>
          <Row justify="center">
            <Col span={24}>
              <Form layout="vertical"
                className="row-col">
                <Row style={{ marginBottom: '20px' }} gutter={50}>
                  <Col span={12}>
                    <p>Law Firm Name</p>
                    <Input
                      placeholder="Law Firm Name"
                      onChange={(e) => { setLawFirmName(e.target.value) }}
                      value={law_firm_name}
                      defaultValue={law_firm_name}
                    />
                  </Col>
                  <Col span={12}>
                    <p>Email</p>
                    <Input
                      placeholder="Email"
                      onChange={(e) => { setEmail(e.target.value) }}
                      value={email}
                      defaultValue={email}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: '20px' }} gutter={50}>
                  <Col span={12}>
                    <p>Phone Number</p>
                    <Input
                      placeholder="Phone Number"
                      onChange={(e) => { setPhoneNumber(e.target.value) }}
                      value={phoneNumber}
                      defaultValue={phoneNumber}
                    />
                  </Col>
                  <Col span={12}>
                    <p>Person Name</p>
                    <Input
                      placeholder="Person Name"
                      onChange={(e) => { setPersonName(e.target.value) }}
                      value={personName}
                      defaultValue={personName}
                    />
                  </Col>
                </Row>

                <Row style={{ marginBottom: '20px' }} gutter={50}>
                  <Col span={12}>
                    <p>Title</p>
                    <Input
                      placeholder="Title"
                      onChange={(e) => { setTitle(e.target.value) }}
                      value={title}
                      defaultValue={title}
                    />
                  </Col>
                  <Col span={12}>
                    <p>Site</p>
                    <Input
                      placeholder="Site"
                      onChange={(e) => { setSiteUrl(e.target.value) }}
                      value={siteUrl}
                      defaultValue={siteUrl}
                    />

                  </Col>
                </Row>
                <Row style={{ marginBottom: '20px' }} gutter={50}>
                  <Col span={12}>
                    <p>Company Linkedin Url</p>
                    <Input
                      placeholder="Company Linkedin Url"
                      onChange={(e) => { setCompanyLinkedinUrl(e.target.value) }}
                      value={companyLinkedinUrl}
                      defaultValue={companyLinkedinUrl}
                    />
                  </Col>
                  <Col span={12}>

                    <p>Person Linkedin Url</p>
                    <Input
                      placeholder="Person Name"
                      onChange={(e) => { setPersonLinkedinUrl(e.target.value) }}
                      value={personLinkedinUrl}
                      defaultValue={personLinkedinUrl}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: '20px' }} gutter={50}>
                  <Col span={24}>
                    <p>Company Address</p>
                    <Input
                      placeholder="Company address(13119 Professional Dr., Ste. 200 Jacksonville, FL 32225)"
                      onChange={(e) => { setCompanyAddress(e.target.value) }}
                      value={companyAddress}
                      defaultValue={companyAddress}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <p>Modifier</p>
                    <TextArea
                      placeholder="I visited your website, johnlaw.com and saw that you website loads slowly..."
                      onChange={(e) => { setModifier(e.target.value) }}
                      value={modifier}
                      defaultValue={modifier}
                      rows={4}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal>

        <Modal title="Delete Lead" visible={deleteLeadModalOpen} onOk={handleDeleteLead} confirmLoading={isLoading} onCancel={handleCancel}>
          <h3>Are you sure?</h3>
        </Modal>
      </div>
    </Context.Provider>
  );
}

export default Home;
