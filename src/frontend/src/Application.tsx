import React from "react";
import { render } from "react-dom";
import { RestfulProvider } from "restful-react";
import "../styles.less";
import LandingPage from "./LandingPage";

render(
  <RestfulProvider base="http://localhost:5000">
    <LandingPage />
  </RestfulProvider>,
  document.getElementById("application")
);
