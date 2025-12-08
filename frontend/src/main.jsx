import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { Provider } from 'react-redux'
import { store } from './store/Store.js'
import Chat from './components/Chat.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path: "",
        element:<Chat/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "chat",
        element: <Chat/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)
