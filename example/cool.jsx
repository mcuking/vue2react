import react, { Component } from "react";
import PropTypes from "PropType";
import Loader from "./Loader";
export default class CoolDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      name: "tom",
      item: {
        id: "123"
      }
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

  componentWillMount() {
    this.setState({
      name: "jerry"
    });
    this.state.name.we = 1;
  }

  componentDidMount() {
    console.log(this.state.name);
    document.addEventListener("click", this.handlePageClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handlePageClick);
  }

  handlePageClick(e) {
    const {
      name
    } = this;
    console.log("page click", e, name);
  }

  handleTitleClick(e) {
    const {
      id
    } = this.state.item;
    console.log("title clicked", e, id);
  }

  render() {
    const reverseName = this.state.name.split("").reverse().join("");
    const wrappedTitle = `Title is ${this.props.title}`;
  }

}