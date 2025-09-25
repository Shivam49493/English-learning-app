
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import AuthContext from './contexts/AuthContext.jsx'
import UserContext from './contexts/UserContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
     <BrowserRouter>
     <AuthContext>
        <UserContext>
          
            <App />
          
        </UserContext>
      </AuthContext>,
     </BrowserRouter>
)
