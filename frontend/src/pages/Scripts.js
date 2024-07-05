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
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
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
  const [buttonLoading, setButtonLoading] = useState(false);
  const [script, setScript] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const history = useHistory();


  useEffect(() => {
    if (user == null) {
      history.push("/")
      return
    }
    axios
      .get(`${backend_api}/script?user_id=${user.id}`)
      .then((response) => {
        if (response.status == 200) {
          console.log("Scripts", response.data);
          if (response.data.success) {
            console.log(response.data.message[0])
            setScripts(response.data.message[0].script);
            setIsAdd(response.data.message[0].length == 0);
          }
          else
            api.info({
              message: `Server Error`,
              description: (
                <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
              ),
              placement: "topRight",
            });
        } else {
          api.info({
            message: `Server Error`,
            description: (
              <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
            ),
            placement: "topRight",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  const handleOk = (e) => {
    setopenModal(false);
  };

  const handleCancel = (e) => {
    setopenModal(false);
    setOpenEditModal(false);
    setOpenAddModal(false);
  };

  const handleCategoryChange = (e) => {
  };
  const handlePromptChange = (e) => {
  };

  const handleEditOk = () => {
    let data = {
      Prompt: prompt,
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
                      {({ }) => `Updated successfully`}
                    </Context.Consumer>
                  ),
                  placement: "topRight",
                });
              } else {
                api.info({
                  message: `Edit Failed`,
                  description: (
                    <Context.Consumer>
                      {({ }) => `Error Occured`}
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
              <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
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
    setButtonLoading(true)
    let script = {
      user_id: user.id,
      script: scripts
    }
    axios
      .post(`${backend_api}/script`, script)
      .then((response) => {
        if (response.status == 200) {
          console.log("Scripts", response.data);
          if (response.data.success) {
            console.log(response.data.message)
            setScripts(response.data.message.script);
          }
          else
            api.info({
              message: `Server Error`,
              description: (
                <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
              ),
              placement: "topRight",
            });
        } else {
          api.info({
            message: `Server Error`,
            description: (
              <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
            ),
            placement: "topRight",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        setButtonLoading(false)
      });

  }

  const handleAddOk = () => {
    if (!prompt)
      api.info({
        message: `Input Error`,
        description: (
          <Context.Consumer>
            {({ }) => `Input category & Prompt correctly`}
          </Context.Consumer>
        ),
        placement: "topRight",
      });
    let data = {
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
                      {({ }) => `Updated successfully`}
                    </Context.Consumer>
                  ),
                  placement: "topRight",
                });
              } else {
                api.info({
                  message: `Edit Failed`,
                  description: (
                    <Context.Consumer>
                      {({ }) => `Error Occured`}
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
              <Context.Consumer>{({ }) => `Error Occured`}</Context.Consumer>
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
            <Card title="Script">
              <TextArea
                placeholder="I visited your website, johnlaw.com and saw that you website loads slowly..."
                onChange={(e) => { setScripts(e.target.value) }}
                value={scripts}
                defaultValue={scripts}
                rows={20}
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
            loading={buttonLoading}
          >
            {isAdd ? 'Add' : 'Modify'}
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
