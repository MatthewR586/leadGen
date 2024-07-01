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
  notification,
  Modal,
} from "antd";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { backend_api } from "../config";

const { TextArea } = Input;

const Context = React.createContext({
  name: "Default",
});

function Scripts() {
  const [openModal, setopenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [scripts, setScripts] = useState([]);

  const [prompt, setPrompt] = useState();
  const [category, setCategory] = useState();
  const [recordId, setRecordId] = useState();
  useEffect(() => {
    axios
      .get(`${backend_api}/get_scripts`)
      .then((response) => {
        if (response.status == 200) {
          console.log("Law", response.data.data);
          setScripts(response.data.data);
        } else {
          api.info({
            message: `Server Error`,
            description: (
              <Context.Consumer>{({}) => `Error Occured`}</Context.Consumer>
            ),
            placement: "topRight",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const script_columns = [
    {
      title: "Category",
      dataIndex: "Name",
      key: "Name",
      width: "30%",
      ellipsis: true
    },
    {
      title: "Prompt",
      dataIndex: "Prompt",
      key: "Prompt",
      render: (prompt) => {
        return (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {prompt}
          </div>
        );
      },
      textWrap: "word-break",
      ellipsis: true,
      width: "60%",
    },
    {
      title: "Edit",
      render: (_, record) => {
        return <a onClick={() => handleEditClick(record)}>Edit</a>;
      },
    },
    {
      title: "Delete",
      render: (_, record) => {
        return (
          <a style={{ color: "#ff4d4f" }} onClick={() => onDeleteScriptButtonClick(record)}>
            Delete
          </a>
        );
      },
    },
  ];

  const onDeleteScriptButtonClick = (record) => {
    setopenModal(true);
    setRecordId(record?.id)
  };

  const handleEditClick = (record) => {
    setOpenEditModal(true);
    setPrompt(record?.Prompt);
    setCategory(record?.Name);
    setRecordId(record?.id);
  };

  const handleOk = (e) => {
    console.log(recordId)
    setopenModal(false);
    let data = {
      id: recordId
    }
    axios
      .post(`${backend_api}/delete_script`, data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          axios
            .get(`${backend_api}/get_scripts`)
            .then((response) => {
              if (response.status == 200) {
                console.log("Law", response.data.data);
                setScripts(response.data.data);
                api.success({
                  message: `Success`,
                  description: (
                    <Context.Consumer>
                      {({}) => `Deleted successfully`}
                    </Context.Consumer>
                  ),
                  placement: "topRight",
                });
              } else {
                api.info({
                  message: `Edit Failed`,
                  description: (
                    <Context.Consumer>
                      {({}) => `Error Occured`}
                    </Context.Consumer>
                  ),
                  placement: "topRight",
                });
              }
              setOpenEditModal(false);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          api.info({
            message: `Error`,
            description: (
              <Context.Consumer>{({}) => `Error Occured`}</Context.Consumer>
            ),
            placement: "topRight",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = (e) => {
    setopenModal(false);
    setOpenEditModal(false);
    setOpenAddModal(false);
    setCategory('')
    setPrompt('')
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleEditOk = () => {
    let data = {
      Name: category,
      Prompt: prompt,
      id: recordId,
    };
    axios
      .post(`${backend_api}/edit_script`, data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          axios
            .get(`${backend_api}/get_scripts`)
            .then((response) => {
              if (response.status == 200) {
                console.log("Law", response.data.data);
                setScripts(response.data.data);
                api.success({
                  message: `Success`,
                  description: (
                    <Context.Consumer>
                      {({}) => `Updated successfully`}
                    </Context.Consumer>
                  ),
                  placement: "topRight",
                });
              } else {
                api.info({
                  message: `Edit Failed`,
                  description: (
                    <Context.Consumer>
                      {({}) => `Error Occured`}
                    </Context.Consumer>
                  ),
                  placement: "topRight",
                });
              }
              setOpenEditModal(false);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          api.info({
            message: `Error`,
            description: (
              <Context.Consumer>{({}) => `Error Occured`}</Context.Consumer>
            ),
            placement: "topRight",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddClick = () => {
    setOpenAddModal(true);
  }

  const handleAddOk = () => {
    if(!category || !prompt) 
      api.info({
        message: `Input Error`,
        description: (
          <Context.Consumer>
            {({}) => `Input category & Prompt correctly`}
          </Context.Consumer>
        ),
        placement: "topRight",
      });
    let data = {
      Name: category,
      Prompt: prompt
    };
    axios
      .post(`${backend_api}/add_script`, data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          axios
            .get(`${backend_api}/get_scripts`)
            .then((response) => {
              if (response.status == 200) {
                console.log("Law", response.data.data);
                setScripts(response.data.data);
                api.success({
                  message: `Success`,
                  description: (
                    <Context.Consumer>
                      {({}) => `Updated successfully`}
                    </Context.Consumer>
                  ),
                  placement: "topRight",
                });
              } else {
                api.info({
                  message: `Edit Failed`,
                  description: (
                    <Context.Consumer>
                      {({}) => `Error Occured`}
                    </Context.Consumer>
                  ),
                  placement: "topRight",
                });
              }
              setOpenEditModal(false);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          api.info({
            message: `Error`,
            description: (
              <Context.Consumer>{({}) => `Error Occured`}</Context.Consumer>
            ),
            placement: "topRight",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setOpenAddModal(false);

  };
  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );
  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Scripts">
              <Table
                columns={script_columns}
                dataSource={scripts}
                loading={!scripts.length}
              />
            </Card>
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={() => {
              handleAddClick();
            }}
          >
            Add
          </Button>
        </Row>
        <Modal
          title="Confirm"
          visible={openModal}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Are you sure?</p>
        </Modal>

        <Modal
          title={"Edit"}
          visible={openEditModal}
          onOk={handleEditOk}
          onCancel={handleCancel}
        >
          <Typography.Title level={5}>Category</Typography.Title>
          <Input
            placeholder="Input your category"
            value={category}
            onChange={handleCategoryChange}
          />
          <div style={{ marginBottom: "20px" }}></div>
          <Typography.Title level={5}>Prompt</Typography.Title>
          <TextArea
            placeholder="Input your prompt"
            autoSize={{
              minRows: 2,
            }}
            value={prompt}
            onChange={handlePromptChange}
          />
        </Modal>

        <Modal
          title={"Add"}
          visible={openAddModal}
          onOk={handleAddOk}
          onCancel={handleCancel}
        >
          <Typography.Title level={5}>Category</Typography.Title>
          <Input
            placeholder="Input your category"
            value={category}
            onChange={handleCategoryChange}
          />
          <div style={{ marginBottom: "20px" }}></div>
          <Typography.Title level={5}>Prompt</Typography.Title>
          <TextArea
            placeholder="Input your prompt"
            autoSize={{
              minRows: 2,
              maxRows: 16,
            }}
            value={prompt}
            onChange={handlePromptChange}
          />
        </Modal>

      </div>
    </Context.Provider>
  );
}

export default Scripts;
