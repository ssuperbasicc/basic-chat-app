import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { parseJwt } from "../../utilities/parseJwt"
import {
    Card,
    Row,
    Col
} from 'react-bootstrap'
import SidebarSection from "./sidebarSection"
import MessageSection from "./messageSection"
import { GET_ROOMS } from '../../graphql/queries/rooms'
import { GET_MESSAGES } from "../../graphql/queries/messages"
import { useQuery, useLazyQuery } from "@apollo/client"
import SOCKET_CLIENT from "../../utilities/socket.io"

const MainPage = () => {
    const currentUserId = parseJwt()?.aud
    const nav = useNavigate()

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [havingNext, setHavingNext] = useState(false)
    const [activeRoomId, setActiveRoomId] = useState(0)

    const [offset, setOffset] = useState(0)
    const limit = 20

    const [isDefaultScreen, setIsDefaultScreen] = useState(true)

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
                                        <a
                                            href="#"
                                            onClick={_handleLogout}
                                        >
                                            Logout
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <div className="p-1">
                                <Row>
                                    <Col
                                        xl={6}
                                        lg={6}
                                        md={6}
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
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                       {
                                            isDefaultScreen
                                            ?
                                            <div className="text-center my-4">
                                                Lets start your conversations!
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
        </>
    )
}



export default MainPage