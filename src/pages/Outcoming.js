
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
  Badge,
  notification
} from "antd";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { backend_api } from "../config";
const Context = React.createContext({
  name: 'Default',
});
const call_history_columns = [
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
    render: ((date) => {
      const newDate = new Date(date);
      const options = {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
      };

      const newYorkTime = newDate.toLocaleDateString('en-US', options);
      return (
        <div>{newYorkTime}</div>
      )
    })
  },
  {
    title: "Phone Number",
    dataIndex: "to",
    key: "to",
  },
  // {
  //   title: "Name",
  //   dataIndex: "patientName",
  //   key: "patientName",
  // },
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
        <div style={{ whiteSpace: 'pre-wrap' }}>{record.summary}</div>
      </Space>
    ),
  },

  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (_, record) => (
      <Space size="middle">
        <div style={{ backgroundColor: record.status == "completed" ? "#059212" : "#EE4E4E", padding: '3px', color: 'white', borderRadius: '3px' }}>{record.status || 'Error'}</div>
      </Space>
    ),
  },
];

function Outcoming() {
  const [callLogs, setCallLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    console.log(process.env.REACT_APP_BLAND_AUTH)
    const headers = {
      'Authorization': process.env.REACT_APP_BLAND_AUTH
    };
    setLoading(true)
    axios.get('https://api.bland.ai/v1/calls', { headers }).then((response) => {
      console.log(response)

    
    }).catch(error => {
      console.log("error", error)
      setLoading(false)
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      name: 'Ant Design',
    }),
    [],
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}

    <>
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Outbound Call history">
              <Table
                columns={call_history_columns}
                dataSource={callLogs}
                rowKey={(record) => record.c_id}
                loading={!callLogs?.length}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
    </Context.Provider>
  );
}

export default Outcoming;
