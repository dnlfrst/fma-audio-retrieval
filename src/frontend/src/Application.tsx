import React from "react";
import { render } from "react-dom";
import { RestfulProvider } from "restful-react";
import LandingPage from "./LandingPage";
import "../styles.less";

render(
  <RestfulProvider base="http://localhost:5000">
    <LandingPage />
  </RestfulProvider>,
  document.getElementById("application")
);
