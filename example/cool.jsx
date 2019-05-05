import react, { Component } from "react";
import Loader from "./Loader";
export default class cool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      name: "tom"
    };
  }

  componentDidMount() {
    console.log(this.name);
    document.addEventListener("click", this.handlePageClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handlePageClick);
  }

  handlePageClick(e) {
    console.log("page click", e);
  }

  handleTitleClick(e) {
    console.log("title clicked", e);
  }

}