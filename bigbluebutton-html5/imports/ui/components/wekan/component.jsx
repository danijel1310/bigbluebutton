import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';


class Wekan extends Component {
    constructor(props) {
        super(props);


    }

    render() {
        const {wekanUrl} = this.props;

        return (
          <div
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
            <iframe
                id="wekan-iframe"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
                ref="iframe"
                src={wekanUrl}
                width="100%"
                scrolling="no"
                frameBorder="0"
            >

            </iframe>
          </div>  
        );
    }
}

export default injectIntl(injectWbResizeEvent(Wekan));