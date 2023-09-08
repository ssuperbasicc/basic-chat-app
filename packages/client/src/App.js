import { useEffect } from 'react'
import logo from './logo.svg';
import './App.css';
import SOCKET_CLIENT from './utilities/socket.io'

function App() {

  useEffect(() => {
    function handleConnect() {
      console.debug('SERVER CONNECTED')
    }

    function handleDisconnected() {
      console.debug('SERVER DISCONNECTED')
    }

    SOCKET_CLIENT.on('connect', handleConnect)
    SOCKET_CLIENT.on('disconnect', handleDisconnected)

    return () => {
      SOCKET_CLIENT.off('connect', handleConnect)
      SOCKET_CLIENT.off('disconnect', handleDisconnected)
    }
  }, [])

  useEffect(() => {
    SOCKET_CLIENT.connect()

    return () => {
      SOCKET_CLIENT.disconnect()
    }
  }, [])
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
