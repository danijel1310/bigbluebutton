import React, { Component } from 'react';
import Modal from '/imports/ui/components/modal/simple/component';
import Button from '/imports/ui/components/button/component';
import { withModalMounter } from '/imports/ui/components/modal/service';
import { defineMessages, injectIntl } from 'react-intl';
import { styles } from './styles';
import { getAllWekanUser, createWekanLink, addParticipantsToBoard, getAllBoardsFromUser, createNewBoard } from '/imports/ui/components/wekan/service';


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
            loginUser: {},
            boardType: 'login',
            nameOfNewBoard: '',
            permissionType: 'private',
            boardColor: 'belize',
            boardList: new Array(),
            selectedBoard: '',
            emailInput: '',
            allWekanUser: new Array()
        };

        // const { wekanUrl } = props;

        this.permissionTypeHandler = this.permissionTypeHandler.bind(this);
        this.boardTypeHandler = this.boardTypeHandler.bind(this);
        this.nameOfNewBoardHandler = this.nameOfNewBoardHandler.bind(this);
        this.selectedBoardHandler = this.selectedBoardHandler.bind(this);
        this.boardColorHandler = this.boardColorHandler.bind(this);
        this.emailInputHandler = this.emailInputHandler.bind(this);
        this.resetStates = this.resetStates.bind(this);
        this.wekanLogin = this.wekanLogin.bind(this);
        //this.wekanLogin();



    }

    /*   async wekanLogin() {
  
          const loginuser = await login('implUser', 'implUser');
          const boardsOfUser = await getAllBoardsFromUser(loginuser.id, loginuser.token);
  
          this.setState({ boardList: boardsOfUser });
          this.setState({ loginUser: loginuser });
          const allUser = await getAllWekanUser();
          console.log(allUser);
      } */

    async handleSignIn() {
        const {
            emailInput,
            allWekanUser
        } = this.state;

        let allUser;
        if (allWekanUser.length < 1)
            allUser = await getAllWekanUser();

        this.setState({ allWekanUser: allUser });
        allWekanUser.forEach(user => {
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
        }
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
            const link = createWekanLink(
                selectedBoard.title,
                selectedBoard.id
            );
            addParticipantsToBoard(
                selectedBoard.id,
                false,
                false,
                false,
                true
            ).then((participants) => {
                if (participants) {
                    console.log("this participants could not be added to board");
                    console.log(participants);
                }
                // TODO props.setSource(link);
                alert(link);
            }).catch((error) => console.error(error));
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
                            addParticipantsToBoard(
                                board.id,
                                false,
                                false,
                                false,
                                true
                            ).then((participants) => {
                                if (participants) {
                                    console.log("this participants could not be added to board");
                                    console.log(participants);

                                }
                                const link = createWekanLink(nameOfNewBoard, board.id);
                                // TODO props.setSource(link);
                            }).catch((error) => console.error(error));
                        }
                    })
                    .catch(() => console.error("CREATE NEW BOARD ERROR"));
            }
        }

        this.resetStates();
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
            emailInput
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
                            {boardType !== 'login' &&

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
                                        onChange={this.emailInputHandler()}
                                    />
                                    <Button onClick={this.handleSignIn}>Sign in</Button>
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
                                            <option key={board.id} value={board.title}>
                                                {board.title}
                                            </option>)}
                                    </select>
                                )
                            }
                        </div>
                        <div>
                            <Button onClick={() => this.handleSave()} label="Save" />
                        </div>

                    </div>
                </Modal>
            </>
        );
    }

}

export default injectIntl(withModalMounter(WekanModal));
