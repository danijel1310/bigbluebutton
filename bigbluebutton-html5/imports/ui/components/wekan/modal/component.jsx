import React, { Component } from 'react';
import Modal from '/imports/ui/components/modal/simple/component';
import Button from '/imports/ui/components/button/component';
import { withModalMounter } from '/imports/ui/components/modal/service';
import { defineMessages, injectIntl } from 'react-intl';
import { styles } from './styles';
import { getAllWekanUser, createWekanLink, addParticipantsToBoard, getAllBoardsFromUser, createNewBoard } from '/imports/ui/components/wekan/service';
import MultiSelect from "react-multi-select-component";

/* const intlMessages = defineMessages({
    title: {
        id: 'app.wekan.title',
        description: 'Modal title',
    },
    newBoardInput: {
        id: 'app.wekan.newBoardInput',
        description: 'New Board Input field placeholder',
    },

}); */

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
            allSelectedWekanUserLabels: new Array(),
            errorMessage: ''
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
        this.handleSignIn = this.handleSignIn.bind(this);
        this.wekanLinkHandler = this.wekanLinkHandler.bind(this);
        this.handleSetPermissions = this.handleSetPermissions.bind(this);
        this.getBoardById = this.getBoardById.bind(this);
        this.errorMessageHandler = this.errorMessageHandler.bind(this);
        this.setFirstBoard = this.setFirstBoard.bind(this);
    }



    errorMessageHandler(errorMsg) {
        this.setState({ errorMessage: errorMsg });
    }

    allWekanUserLabelsHandler(allwekanuserlabels) {
        this.setState({ allWekanUserLabels: allwekanuserlabels });
    }

    allSelectedWekanUserLabelsHandler(selectedLabels) {
        this.setState({ allSelectedWekanUserLabels: selectedLabels });
    }

    async getBoardById(id) {
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
            this.errorMessageHandler('');
        } else {
            this.errorMessageHandler('There is no known account with this email address');
        }

        this.createAllWekanUserLabels();
    }

    setFirstBoard() {
        const {
            boardList
        } = this.state;

        if(boardList.length > 0) {
            this.setState({selectedBoard: boardList[0].id});
        }
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
        if(ev.target.value === 'list') {
            this.setFirstBoard();
        } else {
            this.setState({selectedBoard: ''});
        }
        this.setState({ boardType: ev.target.value });
    }

    nameOfNewBoardHandler(ev) {
        this.setState({ nameOfNewBoard: ev.target.value });
    }

    selectedBoardHandler(ev) {
        this.setState({ selectedBoard: ev.target.value });
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

        console.log(`selected board: ${selectedBoard}`);
        console.log(`boardType: ${boardType}`);

        if (selectedBoard && boardType === 'list') {
            const board = await this.getBoardById(selectedBoard);
            const link = createWekanLink(
                board.title,
                board.id
            );
            this.wekanLinkHandler(link);
            this.setState({ boardType: 'permission' });
            return;
        } else if(boardType === 'new') {
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
    }

    async handleSetPermissions() {
        const {
            allSelectedWekanUserLabels,
            selectedBoard,
            wekanLink
        } = this.state;

        const board = await this.getBoardById(selectedBoard);
        if (allSelectedWekanUserLabels && board)
            await addParticipantsToBoard(board.id, allSelectedWekanUserLabels, false, false, false, true);
        //this.setState({ boardType: 'frame' });
        //alert(wekanLink);

        //TODO set wekanLink into Meeting state
        const { closeModal } = this.props;
        closeModal();
    }

    validateSave() {
        const {
            boardType,
            nameOfNewBoard
        } = this.state;

        if (boardType === 'new' && nameOfNewBoard === '') {
            return true;
        } else {
            return false;
        }
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
            allSelectedWekanUserLabels,
            errorMessage
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
                        <h3 className={styles.title}>Wekan Presettings</h3>
                    </header>

                    <div className={styles.content}>

                        {boardType !== 'login' && boardType !== 'permission' &&
                            <div className={styles.inputStyle}>
                                Select board
                                <label htmlFor="boardType">
                                    <select id="boardType" value={boardType} onChange={this.boardTypeHandler}>
                                        <option value="new">New Board</option>
                                        <option value="list">Existing Board</option>
                                    </select>
                                </label>
                            </div>
                        }
                        {boardType === 'login' && (
                            <div>
                                <div className={styles.inputStyle}>
                                    <label htmlFor="email-input">
                                        Email address
                                        <input
                                            style={styles.input}
                                            value={emailInput}
                                            onChange={this.emailInputHandler}
                                            placeholder="Please enter your Email address"
                                        />
                                    </label>
                                    <div className="wekanRegisterNote">
                                        If you don't have a wekan account yet, please register at https://pfaender.fairteaching.net/wekan/.
                                        The email address is the same one you used for your BigBlueButton registration.
                                    </div>
                                </div>
                                {
                                    errorMessage &&
                                    <div className={styles.inputError}>
                                        {errorMessage}
                                    </div>
                                }
                                <div className={styles.centeredContent}>
                                    <Button className={styles.startBtn} id="email-input" label="Sign in" onClick={this.handleSignIn} />
                                </div>
                            </div>
                        )}
                        {boardType === 'new' && (
                            <div className={styles.inputStyle}>
                                <label htmlFor="newBoardName">
                                    Board name *
                                    <input
                                        id="newBoardName"
                                        placeholder="Please enter the name of the new board"
                                        value={nameOfNewBoard}
                                        onChange={this.nameOfNewBoardHandler}
                                    />
                                </label>
                                <label htmlFor="boardPermission">
                                    Board visbility
                                    <select
                                        id="boardPermission"
                                        value={permissionType}
                                        onChange={this.permissionTypeHandler}
                                    >
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                </label>
                                <label htmlFor="boardColor">
                                    Board color
                                    <select
                                        id="boardColor"
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
                                </label>
                            </div>
                        )}

                        {boardType === 'list' && boardList
                            && (
                                <div className={styles.inputStyle}>
                                    <label htmlFor="existingBoardSelection">
                                        Existing board selection
                                        <select
                                            id="existingBoardSelection"
                                            value={selectedBoard}
                                            onChange={this.selectedBoardHandler}
                                        >
                                            {boardList.map(board =>
                                                <option key={board.id} value={board.id}>
                                                    {board.title}
                                                </option>)}
                                        </select>
                                    </label>
                                </div>
                            )
                        }

                        {boardType === 'permission' && selectedBoard && wekanLink && allWekanUserLabels &&

                            <div>
                                <div className="multiSelectInput">
                                    <div className={styles.permissionSelectDiv}>
                                        <label htmlFor="permissionSelection">
                                            Select the users you want to collaborate on your wekan board

                                            <MultiSelect
                                                options={allWekanUserLabels}
                                                value={allSelectedWekanUserLabels}
                                                onChange={this.allSelectedWekanUserLabelsHandler}
                                                labelledBy="Select"
                                            />
                                        </label>
                                    </div>
                                    <div className={styles.placeholder}/>
                                </div>
                                <div className={styles.centeredContent}>
                                    <Button className={styles.startBtn} onClick={this.handleSetPermissions} label="Set Permissions" />
                                </div>

                            </div>
                        }

                        {
                            (boardType === 'list' || boardType === 'new') &&
                            <div className={styles.centeredContent}>
                                <Button disabled={this.validateSave()} className={styles.startBtn} onClick={() => this.handleSave()} label="Save" />
                            </div>
                        }
                    </div>
                </Modal>
            </>
        );
    }

}

export default injectIntl(withModalMounter(WekanModal));