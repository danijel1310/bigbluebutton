import Meetings from "../../../api/meetings";
import Auth from '/imports/ui/services/auth';

import { makeCall } from '/imports/ui/services/api';

const startShowDrawio = () => {
    // instead of making makeCall on meteor (backend) just display
    demo();
};

const getDrawioShowing = () => {
    const meetingId = Auth.meetingID;
    const meeting = Meetings.findOne({ meetingId });
    /*
    const db = Mongo.createCollection('testcol',
    {
        drawioEnabled: false,
        wekanEnabled: false
    });
    const col = new Mongo.Collection('testcol');
    col.insert({drawioEnabled: true});
    */
    const url = 'https://www.youtube.com/watch?v=F9C0T_O7cIo';
    //Meetings.update({ meetingId }, { $set: { url } });
    //console.log(col);
    console.log(meeting);
}

const startDrawio = () => {
    let showingDrawio = 'true';

    makeCall('startShowingDrawio', {showingDrawio});
};

function demo() {
    const syncFetch = true;
   
    getDrawioShowing();
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
    startDrawio
};
