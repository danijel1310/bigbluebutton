import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withModalMounter } from '/imports/ui/components/modal/service';
import WekanModal from './component';
import {
  login, addParticipantsToBoard, getAllBoardsFromUser, createNewBoard,
} from '/imports/ui/components/wekan/service';

const WekanModalContainer = props => <WekanModal {...props} />;


export default withModalMounter(withTracker(({ mountModal }) => ({
  closeModal: () => {
    mountModal(null);
  },
  startWekan: () => alert('START WEKANasdasdasdasdasdsa'),
  wekanUrl: () => alert('WEKAN'),
}))(WekanModalContainer));
