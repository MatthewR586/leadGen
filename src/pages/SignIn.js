// /*!
// =========================================================
// * Muse Ant Design Dashboard - v1.0.0
// =========================================================
// * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
// * Copyright 2021 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
// * Coded by Creative Tim
// =========================================================
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */
// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import {
//   Layout,
//   Menu,
//   Button,
//   Row,
//   Col,
//   Typography,
//   Form,
//   Input,
//   Switch,
//   notification,
//   Modal
// } from "antd";
// import signinbg from "../assets/images/img-signin.jpg";
// import {
//   DribbbleOutlined,
//   TwitterOutlined,
//   InstagramOutlined,
//   GithubOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import { backend_api } from "../config";

// function onChange(checked) {
//   console.log(`switch to ${checked}`);
// }

// const { Title } = Typography;
// const { Header, Footer, Content } = Layout;

// export default class SignIn extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       email: '',
//       password: '',
//       phone: '',
//       isModalOpen: false,
//       sendOTPLoading: false
//     }

//     this.setEmail = this.setEmail.bind(this);
//     this.setPassword = this.setPassword.bind(this);
//     this.handleEmailChange = this.handleEmailChange.bind(this);
//     this.handlePasswordChange = this.handlePasswordChange.bind(this);
//     this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
//     this.handleSendOTP = this.handleSendOTP.bind(this);
//     this.handleCancel = this.handleCancel.bind(this);
//   }

//   handleSendOTP() {

//   }

//   handleCancel() {
//     this.setState({isModalOpen: false})
//   }

//   setEmail(userEmail) {
//     this.setState({ email: userEmail });
//   }

//   setPassword(userPassword) {
//     this.setState({ password: userPassword });
//   }
//   setPhoneNumber(usrePhoneNumber) {
//     this.setState({ phone: usrePhoneNumber })
//   }

//   handleEmailChange(e) {
//     this.setEmail(e.target.value);
//   }

//   handlePasswordChange(e) {
//     this.setPassword(e.target.value);
//   }

//   handlePhoneNumberChange(e) {
//     this.setPhoneNumber(e.target?.value);
//   }

//   handleSignIn = () => {
//     const { email, password } = this.state;
//     const isSameEmail = email == "admin@orlovichpainmd.com"
//     console.log(typeof isSameEmail, password == "admin588588");

//     axios.post(`${backend_api}/send_otp`, {email}).then(response => {
//       console.log(response)
//       if(response.status == 200) {
//         if (response.data.success == true)
//         {
//           this.setState({isModalOpen: true})
//         }
//         else {

//         }
//       } else {

//       }
//     }).catch(error => console.log(error))


//   }

//   render() {
//     const onFinish = (values) => {
//       console.log("Success:", values);
//     };

//     const onFinishFailed = (errorInfo) => {
//       console.log("Failed:", errorInfo);
//     };

//     return (
//       <>
//         <Layout className="layout-default layout-signin">
//           <Content className="signin">
//             <Row gutter={[24, 0]} justify="space-around">
//               <Col
//                 xs={{ span: 24, offset: 0 }}
//                 lg={{ span: 6, offset: 2 }}
//                 md={{ span: 12 }}
//               >
//                 <Title className="mb-15">Sign In</Title>
//                 <Title className="font-regular text-muted" level={5}>
//                   Enter your email addresss to send OTP
//                 </Title>
//                 <Form
//                   onFinish={onFinish}
//                   onFinishFailed={onFinishFailed}
//                   layout="vertical"
//                   className="row-col"
//                 >
//                   {/* <Form.Item
//                     className="username"
//                     label="Email"
//                     name="email"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please input your email!",
//                       },
//                     ]}
//                   >
//                     <Input 
//                       placeholder="Email" 
//                       onChange={(e) => {this.handleEmailChange(e)}} 
//                       value={this.state.email}
//                     />
//                   </Form.Item>

//                   <Form.Item
//                     className="username"
//                     label="Password"
//                     name="password"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please input your password!",
//                       },
//                     ]}
//                   >
//                     <Input 
//                       placeholder="Password" 
//                       onChange={(e) => {
//                         console.log(e)
//                         this.handlePasswordChange(e)
//                       }} 
//                       type="password" 
//                       value={this.state.password}
//                     />
//                   </Form.Item> */}

//                   <Form.Item
//                     className="username"
//                     label="Email"
//                     name="email"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please input your email!",
//                       },
//                     ]}
//                   >
//                     <Input
//                       placeholder="Email"
//                       onChange={(e) => { this.handleEmailChange(e) }}
//                       value={this.state.email}
//                     />
//                   </Form.Item>

//                   <Form.Item>
//                     <Button
//                       type="primary"
//                       style={{ width: "100%" }}
//                       onClick={this.handleSignIn}
//                     >
//                       SEND CODE
//                     </Button>
//                   </Form.Item>

//                 </Form>
//               </Col>
//             </Row>
//           </Content>
//         </Layout>
//         <Modal title="Add New Email" visible={true} onOk={this.handleSendOTP} confirmLoading={this.sendOTPLoading} onCancel={this.handleCancel}>
//           <Row>
//            <Form>
//             <Form.Item>
//              <Input.OTP length={8} />
//             </Form.Item>
//            </Form>
//           </Row>
//         </Modal>
//       </>
//     );
//   }
// }


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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  notification,
  Modal
} from "antd";
import signinbg from "../assets/images/img-signin.jpg";
import {
  DribbbleOutlined,
  TwitterOutlined,
  InstagramOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { backend_api } from "../config";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [token, setToken] = useState('');
  const [OTPCode, setOTPCode] = useState('');
  const [sendButtonLoading, setSendButtonLoading] = useState(false);
  const history = useHistory();

  const handleSendOTP = () => {
    setSendOTPLoading(true);
    axios.post(`${backend_api}/verify_otp`, { token: token, code: OTPCode}).then(response => {
      console.log(response)
      
      if (response.status == 200) {
        if (response.data.success == true) {
          history.push('/dashboard')
        } else {
          notification.error({ message: 'Error', description: 'Failed to Login' });
        }
      } else {
        notification.error({ message: 'Error', description: 'Failed to send OTP' });
      }
      setSendOTPLoading(false);
    }).catch(error => {
      console.log(error);
      notification.error({ message: 'Error', description: 'Failed to send OTP' });
      setSendOTPLoading(false);
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const handleSignIn = () => {
    if(email == '') {
      notification.info({message: 'Input your Email', description: 'Input your email address correctly'})
      return
    }
    setSendButtonLoading(true);
    axios.post(`${backend_api}/send_otp`, { email }).then(response => {
      if (response.status == 200) {
        if (response.data.success == true) {
          notification.success({message: 'Successfully Sent', description: 'Please check your email to get the code'})
          setIsModalOpen(true);
          setToken(response.data.token)
        } else {
          notification.error({ message: 'Error', description: 'Failed to send OTP' });
        }
      } else {
        notification.error({ message: 'Error', description: 'Failed to send OTP' });
      }
    }).catch(error => {
      console.log(error)
      notification.error({ message: 'Error', description: 'Failed to send OTP' });
    }).finally(() => {
      setSendButtonLoading(false);
    })
  }

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your email addresss to send OTP
              </Title>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Email"
                    onChange={(e) => { setEmail(e.target.value) }}
                    value={email}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={handleSignIn}
                    loading={sendButtonLoading}
                  >
                    SEND CODE
                  </Button>
                </Form.Item>

              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
      <Modal title="Input your OTP" visible={isModalOpen} onOk={handleSendOTP} confirmLoading={sendOTPLoading} onCancel={handleCancel}>
        <Row justify="center">
          <Col span={24}>
            <Form>
              <Form.Item>
                <Input onChange={(e) => {setOTPCode(e.target.value)}}/>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
}

export default SignIn;
