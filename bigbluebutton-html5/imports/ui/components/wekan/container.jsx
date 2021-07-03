import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { getWekanShowing } from './service';
import Wekan from './component';

const WekanContainer = props => <Wekan {...props} />;

export default withTracker(() => ({
  wekanUrl: getWekanShowing(),
}))(WekanContainer);
