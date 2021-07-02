import Meetings from "../../../api/meetings";
import Auth from '/imports/ui/services/auth';

import { makeCall } from '/imports/ui/services/api';

const startShowDrawio = () => {
    // instead of making makeCall on meteor (backend) just display
    demo();
};

const getDrawioShowing = () => {
    const meetingId = Auth.meetingID;
    const meeting = Meetings.findOne({ meetingId }, { fields: { showingDrawio: 1 } });

    console.log(meeting);

    return meeting && meeting.showingDrawio;
}

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
    const syncFetch = true;
    startDrawio();
    setTimeout(() => {
        const iframe = document.getElementById('draw-io-iframe').contentWindow;
        elements = iframe.document.getElementsByClassName('geButton');

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].title == 'Online' || elements[i].title == 'Disconnected') {
                eTitle = elements[i];
                eTitle.click();
            }
        }
        if (syncFetch) {
            demo();
        }
    }, 3000);
}

export {
    startShowDrawio,
    getDrawioShowing,
    startDrawio,
    stopDrawio,
    readMeeting
};
