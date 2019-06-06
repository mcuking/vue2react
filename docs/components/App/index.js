import React from 'react';
import Header from '../Header';
import CodeEditor from '../CodeEditor';
import { transformCode } from 'src/index.ts';
import initalCode from '../../common/util/initalCode';

import './index.less';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceCode: initalCode,
      targetCode: '',
      error: ''
    };
  }

  handleUpdateCode = code => {
    this.setState({
      sourceCode: code
    });
  };

  handleTransform = () => {
    const script = transformCode(this.state.sourceCode)[0];
    this.setState({
      targetCode: script,
      error: ''
    });
  };

  render() {
    const { sourceCode, targetCode, error } = this.state;
    return (
      <div className="app">
        <Header
          sourceCode={sourceCode}
          targetCode={targetCode}
          handleTransform={this.handleTransform}
          handleUpdateCode={this.handleUpdateCode}
        />
        <div className="container">
          <div className="sub-container">
            <CodeEditor
              code={sourceCode}
              handleUpdateCode={this.handleUpdateCode}
            />
          </div>
          <div className="sub-container">
            <CodeEditor code={targetCode} error={error} readOnly={true} />
          </div>
        </div>
      </div>
    );
  }
}

// export default function App() {
//   const [sourceCode, setSourceCode, clearSourceCode] = usePersist(
//     'sourceCode',
//     initalCode,
//     true
//   );
//   const [targetCode, setTargetCode] = useState('');
//   const [error, setError] = useState('');

//   const handleUpdateCode = code => {
//     setSourceCode(code);
//     setError('');
//   };

//   const handleTransform = () => {
//     const script = transformCode(sourceCode)[0];
//     setTargetCode(script);
//     setTargetCode(1);
//   };

//   return (
//     <div className="app">
//       <Header
//         sourceCode={sourceCode}
//         targetCode={targetCode}
//         handleTransform={handleTransform}
//         handleUpdateCode={handleUpdateCode}
//       />
//       <div className="container">
//         <div className="sub-container">
//           <CodeEditor code={sourceCode} handleUpdateCode={handleUpdateCode} />
//         </div>
//         <div className="sub-container">
//           <CodeEditor code={targetCode} error={error} readOnly={true} />
//         </div>
//       </div>
//     </div>
//   );
// }
