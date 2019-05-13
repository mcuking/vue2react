import react, { Component } from "react";
import PropTypes from "PropType";
import Loader from "./Loader";
export default class CoolDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      name: "tom"
    };
  }

  static propType = {
    list: PropTypes.boolean,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    list2: PropTypes.array.isRequired,
    list3: PropTypes.object
  };
  static defaultProps = {
    title: "hello world",
    list2: [],
    list3: {
      message: "hello"
    }
  };

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

  render() {
    const reverseName = this.name.split("").reverse().join("");
    const wrappedTitle = `Title is ${this.title}`;
  }

}