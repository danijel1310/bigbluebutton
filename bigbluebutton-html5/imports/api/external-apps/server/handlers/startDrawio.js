import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import Users from '/imports/api/users';
import Meetings from '/imports/api/meetings';

export default function handleStartDrawio({ header, body }, meetingId) {
    const { userId } = header;
    check(body, Object);
    check(meetingId, String);
    check(userId, String);

    const showingDrawio = body.showingDrawio;
    const user = Users.findOne({ meetingId: meetingId, userId: userId })

    /*
    const modifier = {
      $set: {
        showingDrawio: isPublished,
      },
    };
    */
    if (user && user.presenter) {
        try {
            console.log("update meetings object..")
            Meetings.update({ meetingId }, { $set: { showingDrawio} });
            Logger.info(`User id=${userId} setting drawio attribute: ${showingDrawio} for meeting ${meetingId}`);
        } catch (err) {
            Logger.error(`Error on setting drawio start in Meetings collection: ${err}`);
        }
    }
}
