import "bootstrap";
import "../styles/index.scss";
import { App } from "./app.js";

$(function() {
  const app = new App();
  if (process.env.NODE_ENV !== "production") {
    window.app = app;
  }
});
