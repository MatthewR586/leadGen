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
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Mail from "./pages/Mail";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Incoming from "./pages/Incoming";
import Scripts from "./pages/Scripts";
import Outcoming from "./pages/Outcoming";
import OcrResult from "./pages/OcrResult";
import { useEffect } from "react";

function App() {

  useEffect(() => {
       
  }, [])
  

  return (
    <div className="App">
      <Switch>
        {/* <Route path="/" exact component={SignIn} /> */}
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/incoming" component={Incoming} />
          <Route exact path="/scripts" component={Scripts} />
          <Route exact path="/outcoming" component={Outcoming} />
          <Route exact path="/mail" component={Mail} />
          <Route exact path="/ocr" component={OcrResult} />
          <Redirect from="/" to="/dashboard" />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
