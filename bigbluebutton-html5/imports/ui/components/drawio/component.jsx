import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import ReactDOM from 'react-dom';
import { startShowDrawio } from './service';
import { styles } from './styles';

class Drawio extends Component {
  constructor(props) {
    super(props);

    this.handleResize = this.handleResize.bind(this);

    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    // const height = this.divElement.clientHeight;
    // this.setState({ height });
  }

  handleResize() {

  }


  render() {
    const { drawioUrl } = this.props;

    return (

      <div
                // id="draw-io"
                // data-test="drawio"
                // ref={(divElement) => { this.divElement = divElement }}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <button
          id="get_token"
          onClick={startShowDrawio}
        >
Get Token
        </button>
        <iframe
          id="draw-io-iframe"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          ref="iframe"
          src={drawioUrl}
          width="100%"
          height={this.state.iFrameHeight}
          scrolling="no"
          frameBorder="0"
        />
      </div>
    );
  }
}

export default injectIntl(injectWbResizeEvent(Drawio));
