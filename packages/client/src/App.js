import { useEffect, Suspense } from 'react'
import './App.css';
import SOCKET_CLIENT from './utilities/socket.io'
import ROUTES from './routes/registerRoutes'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import client from './utilities/apolloClient'
import { ApolloProvider } from '@apollo/client'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const router = createBrowserRouter(ROUTES)

  const loading = (
    <div>Loading...</div>
  )

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
    <>
      <ApolloProvider client={client}>
        <Suspense fallback={loading}>
          <RouterProvider router={router}/>
        </Suspense>
      </ApolloProvider>
    </>
  )
}

export default App;
