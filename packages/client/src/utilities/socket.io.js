import { io } from "socket.io-client"

const {
    REACT_APP_WS_BASE_URL,
    REACT_APP_WS_PATH
} = process.env

const SOCKET_CLIENT = io(REACT_APP_WS_BASE_URL, {
    autoConnect: true,
    path: REACT_APP_WS_PATH
})

export default SOCKET_CLIENT