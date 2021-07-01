import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { getVideoUrl } from './service';
import Drawio from './component';

const DrawioContainer = props => (
  <Drawio {...{ ...props }} />
);

export default withTracker(() => ({
  drawioUrl: 'https://pfaender.fairteaching.net/drawio/',
}))(DrawioContainer);
