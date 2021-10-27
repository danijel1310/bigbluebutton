import Meetings from "../../../api/meetings";
import Auth from '/imports/ui/services/auth';

import { makeCall } from '/imports/ui/services/api';

const syncFetch = () => {
    // instead of making makeCall on meteor (backend) just display
    const syncFetching = true;
    
    setTimeout(() => {
        const iframe = document.getElementById('draw-io-iframe').contentWindow;
        elements = iframe.document.getElementsByClassName('geButton');

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].title == 'Online' || elements[i].title == 'Disconnected') {
                eTitle = elements[i];
                eTitle.click();
            }
        }
        if (syncFetching) {
            syncFetch();
        }
    }, 3000);
};

const getDrawioShowing = () => {
    const meetingId = Auth.meetingID;
    const prntMeeting = Meetings.findOne({meetingId});
    console.log(prntMeeting);

    const meeting = Meetings.findOne({ meetingId }, { fields: { showingDrawio: 1 } });

    return meeting && meeting.showingDrawio;
};

const startDrawio = () => {
    let showingDrawio = true;

    makeCall('startShowingDrawio', { showingDrawio });
};

const stopDrawio = () => {
    let showingDrawio = false;

    makeCall('stopShowingDrawio', { showingDrawio });
}

const readMeeting = () => {
    getDrawioShowing();
}

function demo() {
    
}

export {
    syncFetch,
    getDrawioShowing,
    startDrawio,
    stopDrawio,
    readMeeting
};
