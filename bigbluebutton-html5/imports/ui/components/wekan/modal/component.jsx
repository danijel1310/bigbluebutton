import React, { Component } from 'react';
import Modal from '/imports/ui/components/modal/simple/component';
import Button from '/imports/ui/components/button/component';
import { withModalMounter } from '/imports/ui/components/modal/service';
import { defineMessages, injectIntl } from 'react-intl';
import { styles } from './styles';
import { getAllWekanUser, createWekanLink, addParticipantsToBoard, getAllBoardsFromUser, createNewBoard } from '/imports/ui/components/wekan/service';
import MultiSelect from "react-multi-select-component";

const intlMessages = defineMessages({
    title: {
        id: 'app.wekan.title',
        description: 'Modal title',
    },
    newBoardInput: {
        id: 'app.wekan.newBoardInput',
        description: 'New Board Input field placeholder',
    },

});


class WekanModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginUser: undefined,
            boardType: 'login',
            nameOfNewBoard: '',
            permissionType: 'public',
            boardColor: 'belize',
            boardList: new Array(),
            selectedBoard: '',
            emailInput: '',
            allWekanUser: new Array(),
            allWekanUserLabels: new Array(),
            wekanLink: '',
            allSelectedWekanUserLabels: new Array()
        };

        // const { wekanUrl } = props;

        this.permissionTypeHandler = this.permissionTypeHandler.bind(this);
        this.boardTypeHandler = this.boardTypeHandler.bind(this);
        this.nameOfNewBoardHandler = this.nameOfNewBoardHandler.bind(this);
        this.selectedBoardHandler = this.selectedBoardHandler.bind(this);
        this.boardColorHandler = this.boardColorHandler.bind(this);
        this.emailInputHandler = this.emailInputHandler.bind(this);
        this.allWekanUserLabelsHandler = this.allWekanUserLabelsHandler.bind(this);
        this.allSelectedWekanUserLabelsHandler = this.allSelectedWekanUserLabelsHandler.bind(this);
        this.resetStates = this.resetStates.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.wekanLinkHandler = this.wekanLinkHandler.bind(this);
        this.handleSetPermissions = this.handleSetPermissions.bind(this);
        this.getBoardById = this.getBoardById.bind(this);



    }

    allWekanUserLabelsHandler(allwekanuserlabels) {
        this.setState({ allWekanUserLabels: allwekanuserlabels });
    }

    allSelectedWekanUserLabelsHandler(selectedLabels) {
        this.setState({ allSelectedWekanUserLabels: selectedLabels });
    }

    getBoardById(id) {
        const { boardList } = this.state;

        let matchedBoard;
        boardList.forEach(board => {
            if (board.id === id) {
                matchedBoard = board;
            }
        });

        return matchedBoard;
    }

    async handleSignIn() {
        const {
            emailInput
        } = this.state;


        const allUser = await getAllWekanUser();

        this.setState({ allWekanUser: allUser });

        allUser.forEach(user => {
            if (user.username === emailInput) {
                this.setState({ loginUser: { username: user.username, id: user.id } });
            }
        });
        const {
            loginUser
        } = this.state;

        if (loginUser) {
            const boardsOfUser = await getAllBoardsFromUser(loginUser.id);
            this.setState({ boardList: boardsOfUser });
            this.setState({ boardType: 'new' });
        }

        this.createAllWekanUserLabels();
    }

    createAllWekanUserLabels() {
        const {
            allWekanUser
        } = this.state;
        if (allWekanUser) {
            const labelArray = new Array();
            allWekanUser.forEach((user) => {
                labelArray.push({ label: user.username, value: user.id });
            });
            this.allWekanUserLabelsHandler(labelArray);
        }
    }

    wekanLinkHandler(link) {
        this.setState({ wekanLink: link })
    }
    emailInputHandler(ev) {
        this.setState({ emailInput: ev.target.value })
    }

    permissionTypeHandler(ev) {
        this.setState({ permissionType: ev.target.value });
    }

    boardColorHandler(ev) {
        this.setState({ boardColor: ev.target.value });
    }

    boardTypeHandler(ev) {
        if (ev && ev.target.value === 'list') {
            this.resetStates();
        }
        this.setState({ boardType: ev.target.value });
    }

    nameOfNewBoardHandler(ev) {
        this.setState({ nameOfNewBoard: ev.target.value });
    }

    selectedBoardHandler(ev) {
        this.setState({ selectedBoard: ev.target.value });
    }

    resetStates() {
        /*  console.log('HI');
         this.setstate = ({
             boardType: 'new',
             nameOfNewBoard: '',
             permissionType: 'private',
             boardColor: 'belize',
             selectedBoard: '',
         }); */
    }

    async handleSave() {

        const {
            loginUser,
            boardType,
            nameOfNewBoard,
            permissionType,
            boardColor,
            selectedBoard,
        } = this.state;


        if (selectedBoard && boardType === 'list') {
            const board = await this.getBoardById(selectedBoard);
            const link = createWekanLink(
                board.title,
                board.id
            );
            this.wekanLinkHandler(link);
            this.setState({ boardType: 'permission' });
            return;
        } else {
            if (loginUser) {
                createNewBoard(
                    nameOfNewBoard,
                    loginUser.id,
                    permissionType,
                    boardColor
                )
                    .then((board) => {
                        if (board && typeof board === 'object') {

                            const link = createWekanLink(board.title, board.id);
                            this.wekanLinkHandler(link);
                            this.setState({ selectedBoard: board });
                            this.setState({ boardType: 'permission' });
                        }
                    })
                    .catch(() => console.error("CREATE NEW BOARD ERROR"));
            }
        }

        this.resetStates();
    }

    async handleSetPermissions() {
        const {
            allSelectedWekanUserLabels,
            selectedBoard,
            wekanLink
        } = this.state;

        const board = await this.getBoardById(selectedBoard);
        if (allSelectedWekanUserLabels)
            await addParticipantsToBoard(board.id, allSelectedWekanUserLabels, false, false, false, true);
        alert(wekanLink);
    }

    render() {
        const { closeModal } = this.props;
        // const { url, sharing } = this.state;

        const {
            boardType,
            nameOfNewBoard,
            permissionType,
            boardColor,
            selectedBoard,
            boardList,
            emailInput,
            wekanLink,
            allWekanUserLabels,
            allSelectedWekanUserLabels
        } = this.state;

        return (
            <>
                <Modal
                    overlayClassName={styles.overlay}
                    className={styles.modal}
                    onRequestClose={closeModal}
                    // contentLabel={intl.formatMessage(intlMessages.title)}
                    hideBorder
                >
                    <header className={styles.header}>
                        <h3 className={styles.title}>Title</h3>
                    </header>

                    <div className={styles.content}>

                        <div>
                            {boardType !== 'login' && boardType !== 'permission' &&

                                <select value={boardType} onChange={this.boardTypeHandler}>
                                    <option value="new">New</option>
                                    <option value="list">List</option>
                                </select>
                            }
                        </div>
                        <div>

                            {boardType === 'login' && (
                                <div>
                                    <input
                                        value={emailInput}
                                        onChange={this.emailInputHandler}
                                    />
                                    <Button label="Sign in" onClick={this.handleSignIn} />
                                </div>
                            )}
                            {boardType === 'new' && (
                                <div>
                                    <input
                                        value={nameOfNewBoard}
                                        onChange={this.nameOfNewBoardHandler}
                                    />
                                    <select
                                        value={permissionType}
                                        onChange={this.permissionTypeHandler}
                                    >
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                    <select
                                        value={boardColor}
                                        onChange={this.boardColorHandler}
                                    >
                                        <option value="belize">belize</option>
                                        <option value="nephritis">nephritis</option>
                                        <option value="pomegranate">pomegranate</option>
                                        <option value="pumpkin">pumpkin</option>
                                        <option value="wisteria">wisteria</option>
                                        <option value="midnight">midnight</option>
                                    </select>
                                </div>
                            )}

                            {boardType === 'list' && boardList
                                && (
                                    <select
                                        value={selectedBoard}
                                        onChange={this.selectedBoardHandler}
                                    >
                                        {boardList.map(board =>
                                            <option key={board.id} value={board.id}>
                                                {board.title}
                                            </option>)}
                                    </select>
                                )
                            }

                            {boardType === 'permission' && selectedBoard && wekanLink && allWekanUserLabels &&

                                <div>
                                    <h3>Set permissions for this user</h3>
                                    <MultiSelect
                                        options={allWekanUserLabels}
                                        value={allSelectedWekanUserLabels}
                                        onChange={this.allSelectedWekanUserLabelsHandler}
                                        labelledBy="Select"
                                    />
                                    <Button onClick={this.handleSetPermissions} label="Set Permissions" />
                                </div>
                            }
                        </div>

                        {
                            (boardType === 'list' || boardType === 'new') &&
                            <div>
                                <Button onClick={() => this.handleSave()} label="Save" />
                            </div>
                        }
                    </div>
                </Modal>
            </>
        );
    }

}

export default injectIntl(withModalMounter(WekanModal));
