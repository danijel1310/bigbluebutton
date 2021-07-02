import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import Users from '/imports/api/users';
import RedisPubSub from '/imports/startup/server/redis';
import { extractCredentials } from '/imports/api/common/server/helpers';
import Meetings from '/imports/api/meetings';

export default function stopShowingDrawio(options) {
    const REDIS_CONFIG = Meteor.settings.private.redis;
    const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
    const EVENT_NAME = 'StopDrawioPubMsg'; 

    const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);
    const { showingDrawio } = options;

    try {
        check(meetingId, String);
        check(userId, String);

        const user = Users.findOne({ meetingId, userId }, { presenter: 1 });

        if (user && user.presenter) {
            check(showingDrawio, Boolean);
            const payload = { showingDrawio };

            // This update method should be removed after redis integration
            Meetings.update({ meetingId }, { $set: { showingDrawio} });

            Logger.debug(`User id=${userId} sending ${EVENT_NAME} drawio bool:${showingDrawio} for meeting ${meetingId}`);
            return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, userId, payload);
        }
        Logger.error(`Only presenters are allowed to start drawio for a meeting. meeting=${meetingId} userId=${userId}`);
    } catch (error) {
        Logger.error(`Error on sharing drawio: ${externalVideoUrl} ${error}`);
    }
}
