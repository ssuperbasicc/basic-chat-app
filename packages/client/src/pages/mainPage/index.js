import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { parseJwt } from "../../utilities/parseJwt"
import {
    Card,
    Row,
    Col,
    Modal,
    ListGroup
} from 'react-bootstrap'
import SidebarSection from "./sidebarSection"
import MessageSection from "./messageSection"
import { GET_ROOMS } from '../../graphql/queries/rooms'
import { GET_MESSAGES } from "../../graphql/queries/messages"
import { GET_ACCOUNT_INFOS } from "../../graphql/queries/accountInfos"
import { useQuery, useLazyQuery } from "@apollo/client"
import SOCKET_CLIENT from "../../utilities/socket.io"
import mainHero from '../../assets/images/hero.jpg'
import dayJS from "../../utilities/dayjs"

const MainPage = () => {
    const currentUserId = parseJwt()?.aud
    const nav = useNavigate()

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [havingNext, setHavingNext] = useState(false)
    const [activeRoomId, setActiveRoomId] = useState(0)

    const [offset, setOffset] = useState(0)
    const limit = 10

    const [isDefaultScreen, setIsDefaultScreen] = useState(true)
    const [modalState, setModalState] = useState(false)
    
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")

    const { 
        loading: loadingAccInfo, 
        error: errorAccInfo, 
        data: dataAccInfo
    } = useQuery(GET_ACCOUNT_INFOS, {
        onCompleted: (data) => {
            console.debug(data)
            const { firstName, lastName, username } = data.accountInfos

            setFullName(`${firstName === null ? "" : firstName} ${lastName === null ? "" : lastName}`)
            setUsername(username)
        },
        onError: (error) => {
            console.debug(error)
        },
        variables: {
            userId: parseInt(currentUserId)
        }
    })

    const { 
        loading: loadingRoom, 
        error: errorRoom, 
        data: dataRoom
    } = useQuery(GET_ROOMS, {
        onCompleted: (data) => {
            console.debug(data)
        },
        onError: (error) => {
            console.debug(error)
        },
        variables: {
            userId: parseInt(currentUserId)
        }
    })

    const [_getChatMessages, {
        loading: loadingGetMessage, 
        error: errorGetMessage, 
        data: dataGetMessage
    }] = useLazyQuery(GET_MESSAGES, {
        onCompleted: (data) => {
            console.debug(data)

            const messageData = data.conversations

            setMessages(list => [...messageData.messages, ...list])
            setHavingNext(messageData.havingNext)
            setOffset(parseInt(messageData.messages[0].id))
        },
        onError: (error) => {
            console.debug(error)
        }
    })

    const _handleSubmitMessage = (e) => {
        e.preventDefault()

        const payloadData = {
            roomId: activeRoomId,
            senderId: currentUserId,
            text: message
        }

        SOCKET_CLIENT.emit("SEND_MESSAGE", payloadData)

        payloadData.sender = currentUserId

        setMessages(list => [...list, payloadData])
        setMessage("")
    }

    const _joinRoom = (roomId) => {
        if (activeRoomId != roomId ) {
            setIsDefaultScreen(false)

            SOCKET_CLIENT.emit("JOIN_ROOM", {roomId})
    
            setActiveRoomId(parseInt(roomId))
                
            _getChatMessages({
                variables: {
                    roomId,
                    offset,
                    limit
                }
            })
        }
    }

    const _handleMessageSent = (data) => {
        setMessages(list => [...list, data])
    }

    const _handleLogout = () => {
        const confirm = window.confirm("Are you sure want to logout?")

        if (confirm) {
            window.sessionStorage.clear()
            window.location = "/"
        }
    }

    const _handleModal = () => {
        setModalState(!modalState)
    }

    useEffect(() => {
        const user = currentUserId

        if (user === undefined) {
            nav('/login')
        }
    }, [])

    useEffect(() => {
        SOCKET_CLIENT.on("MESSAGE_SENT", _handleMessageSent)

        return () => {
            SOCKET_CLIENT.off("MESSAGE_SENT", _handleMessageSent)
        }
    }, [])

    return (
        <>
            <div className="container my-3">
                 <Card>
                    <Card.Body>
                        <Card.Header>
                            <Row>
                                <Col>
                                    <strong>Basic Chat App</strong>
                                </Col>
                                <Col>
                                    <div className="d-flex justify-content-end">
                                        <strong 
                                            className="cursor-pointer"
                                            onClick={_handleModal}
                                        >
                                                ...
                                        </strong>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <div className="p-1">
                                <Row className="row gy-5">
                                    <Col
                                        xl={6}
                                        lg={6}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SidebarSection 
                                            loading={loadingRoom}
                                            error={errorRoom}
                                            data={dataRoom}

                                            currentUserId={currentUserId}

                                            _joinRoom={_joinRoom}
                                        />
                                    </Col>
                                    <Col
                                        xl={6}
                                        lg={6}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                       {
                                            isDefaultScreen
                                            ?
                                            <div className="text-center my-4">
                                                <img 
                                                    className="img-fluid"
                                                    src={mainHero}
                                                    alt="Main Hero Image"
                                                />
                                            </div>
                                            :
                                            <MessageSection 
                                                message={message}
                                                setMessage={setMessage}

                                                activeRoomId={activeRoomId}
                                                offset={offset}
                                                limit={limit}

                                                loading={loadingGetMessage}
                                                error={errorGetMessage}

                                                messages={messages}
                                                havingNext={havingNext}

                                                currentUserId={currentUserId}

                                                _handleSubmit={_handleSubmitMessage}
                                                _getChatMessages={_getChatMessages}
                                            />
                                       }
                                    </Col>
                                </Row>
                            </div>                            
                        </Card.Body>
                    </Card.Body>
                </Card>
            </div>
            <MainModal 
                modalState={modalState}
                _handleModal={_handleModal}
                _handleLogout={_handleLogout}

                fullName={fullName}
                username={username}
            />
        </>
    )
}

const MainModal = (props) => {
    const { 
        modalState, 
        _handleModal, 
        _handleLogout, 
        fullName, 
        username 
    } = props
    return (
        <>
        <Modal size="sm" show={modalState} onHide={_handleModal}>
            <Modal.Header closeButton>
            <Modal.Title>Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted">{fullName} (<i>{username}</i>)</p>
                <ListGroup>
                    <ListGroup.Item 
                        className="cursor-pointer"
                        onClick={_handleLogout}
                    >
                        Logout
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
        </Modal>
        </>
    )
}



export default MainPage