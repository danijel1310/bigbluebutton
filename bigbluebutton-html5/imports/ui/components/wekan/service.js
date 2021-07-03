import { makeCall } from '/imports/ui/services/api';
import Auth from '/imports/ui/services/auth';
import Meetings from "../../../api/meetings";
/* import Auth from '/imports/ui/services/auth';


export const wekanLogin = () => {
    const meeting = Auth.fullInfo;
    console.log(meeting);
} */
export const startWekan = (wekanUrl) => {
    makeCall('startShowingWekan', { wekanUrl });
};

export const stopWekan = () => {
    makeCall('stopShowingWekan');
};

export const getWekanShowing = () => {
    const meetingId = Auth.meetingID;
    const meeting = Meetings.findOne({ meetingId }, { fields: { wekanUrl: 1 } });

    return meeting && meeting.wekanUrl;
};

const getAdmintoken = async () => {
    const adminUser = await login("admin", "implUser");

    if (adminUser && typeof adminUser === "object") {
        return adminUser.token;
    } else {
        return undefined;
    }
}

export const login = async (name, password) => {
    const inputBody = `username=${name}&password=${password}`;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Request-Headers': 'Accept: /',
        Accept: '/',
        Host: 'pfaender.fairteaching.net',
    };

    try {
        const res = await fetch('https://pfaender.fairteaching.net/wekan/users/login/', {
            method: 'POST',
            mode: 'cors',
            body: inputBody,
            headers,
        });
        const body = await res.json();
        if (res.status === 200) {
            return {
                name, password, id: body.id, token: body.token,
            };
        } if (res.status === 400) {
            return body.reason;
        }
        return 'Something went wrong';
    } catch (error) {
        console.error(`LOGIN FETCH: ${error}`);
        return 'Somethin went wrong';
    }
};

export const register = async (email, name, password) => {
    // const uniqueString = require("crypto").randomBytes(8).toString("hex");
    const inputBody = `username=${name}&password=${password}&email=${email}`;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Request-Headers': 'Accept: /',
        Accept: '/',
        Host: 'pfaender.fairteaching.net',
    };

    try {
        const res = await fetch('https://pfaender.fairteaching.net/wekan/users/register/', {
            method: 'POST',
            mode: 'cors',
            body: inputBody,
            headers,
        });
        const body = await res.json();
        if (res.status === 200) {
            return await login(name, password);
        } if (res.status === 400) {
            return body.reason;
        }
        return 'Something went wrong';
    } catch (error) {
        console.error(`REGISTER FETCH: ${error}`);
        return 'Somethin went wrong';
    }
};

export const getAllBoardsFromUser = async (userID) => {
    const token = await getAdmintoken();
    if (!token) {
        return 'Admin login failed';
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        Host: 'pfaender.fairteaching.net',
    };

    return fetch(
        `https://pfaender.fairteaching.net/wekan/api/users/${userID}/boards/`,
        {
            method: 'GET',
            headers,
        },
    )
        .then(async (res) => {
            const body = await res.json();
            if (res.status === 200 && body) {
                const result = new Array();
                for (let i = 0; i < body.length; i++) {
                    result.push({ id: body[i]._id, title: body[i].title });
                }
                return result;
            }
            return [];
        })
        .catch((error) => {
            console.error(`Get All Boards From User FETCH: ${error}`);
            return [];
        });
};

export const createNewBoard = async (boardTitle, ownerId, permission, color) => {
    const token = await getAdmintoken();
    if (!token) {
        return 'Admin login failed';
    }
    const input = {
        title: boardTitle,
        owner: ownerId,
        permission: permission,
        color: color,
    };
    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        Host: "pfaender.fairteaching.net",
        "Content-Type": "application/json",
    };

    return fetch("https://pfaender.fairteaching.net/wekan/api/boards/", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(input),
        headers: headers,
    })
        .then(async function (res) {
            const body = await res.json();
            if (res.status === 200) {
                //await WekanService.addParticipantsToBoard(body._id,false,false,false,true);
                console.log(body);
                return { title: boardTitle, id: body._id };
            } else if (res.status === 400) {
                return body.reason;
            } else {
                return "Something went wrong";
            }
        })
        .catch((error) => {
            console.error("CREATE NEW BOARD FETCH: " + error);
            return "Something went wrong";
        });
}

export const createWekanLink = (boardName, boardId) => `https://pfaender.fairteaching.net/wekan/b/${boardId}/${boardName}`;

export const addParticipantsToBoard = async (boardID, participants, isAdmin, isNoComments, isCommentOnly, isWorker) => {
    const token = await getAdmintoken();
    if (!token) {
        return 'Admin login failed';
    }
    /* const participants = new Array();

    participants.push({
        name: 'test1', password: 'test1', id: 'zaRkQLWcG4C4H2ma4', token: '2xpzrYZrLky9gXprsuzGqU_n8QQuq5hJKpxYBQR3aHd',
    });
    participants.push({
        name: 'test2', password: 'test2', id: 'sGMztTzCSodXzvvNY', token: '0QPI8fj5v3L7L3jA2zjrnlqWqQfPLOaCDk9NZtrQp7e',
    });
    participants.push({
        name: 'test3', password: 'test3', id: 'LptqFS68cvDdbPdvv', token: 'et-4epRH5_67pv2h1YuybIcTKn7LLKqfh9TWMHSZmmj',
    });
    participants.push({
        name: 'amkUser', password: 'amkUser', id: 'nrZSLx3EnvRp53sqJ', token: 'wPaFjWhcvDwqpjG0N8QtwjQRyKAl2c6iVrWdgWRJbdB',
    }); */


    const result = new Array();
    participants.forEach(async (participant) => {
        const resultFetch = await fetchAddUserToBoard(
            boardID,
            participant.value,
            isAdmin,
            isNoComments,
            isCommentOnly,
            isWorker,
            token,
        );
        if (resultFetch) {
            const scndTry = await fetchAddUserToBoard(
                boardID,
                participant.value,
                isAdmin,
                isNoComments,
                isCommentOnly,
                isWorker,
                token,
            );
            if (scndTry) {
                result.push(scndTry);
            }
        }
    });

    return result;
};

const fetchAddUserToBoard = async (boardID, participantID, isAdmin, isNoComments, isCommentOnly, isWorker, adminToken) => {
    const input = {
        action: 'add',
        isAdmin,
        isCommentOnly,
        isNoComments,
        isWorker,
    };

    const headers = {
        Authorization: `Bearer ${adminToken}`,
        Accept: 'application/json',
        Host: 'pfaender.fairteaching.net',
        'Content-Type': 'application/json',
    };

    return fetch(
        `https://pfaender.fairteaching.net/wekan/api/boards/${boardID}/members/${participantID}/add/`,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(input),
            headers,
        },
    )
        .then(async (res) => {
            if (res.status === 200) {
                return undefined;
            } if (res.status === 400) {
                console.log(res);
                return participantID;
            }
        })
        .catch((error) => {
            console.error(`ADD NEW USER TO BOARD FETCH: ${error}`);
        });
};

export const getAllWekanUser = async () => {

    const token = await getAdmintoken();
    if (!token) {
        return 'Admin login failed';
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        Host: 'pfaender.fairteaching.net',
    };

    return fetch(
        `https://pfaender.fairteaching.net/wekan/api/users/`,
        {
            method: 'GET',
            headers,
        },
    )
        .then(async (res) => {
            const body = await res.json();
            if (res.status === 200 && body) {
                const result = new Array();
                for (let i = 0; i < body.length; i++) {
                    result.push({ username: body[i].username, id: body[i]._id });
                }
                return result;
            }
            return [];
        })
        .catch((error) => {
            console.error(`Get All Boards From User FETCH: ${error}`);
            return [];
        });
};
