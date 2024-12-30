import './App.css'
import {Route} from 'react-router-dom'
import Homepage from './Pages/Homepage'
import Chatpage from './Pages/Chatpage'
import { BrowserRouter, Routes } from 'react-router-dom';
import ChatProvider from './Context/ChatProvider'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
            <ChatProvider>
        <Routes>
          {/* Route for Homepage */}
          <Route path="/" element={<Homepage />} />

          {/* Route for Chatpage */}
          <Route path="/chats" element={<Chatpage />} />
        </Routes>
        </ChatProvider>
      </BrowserRouter>
    </div>
  );
}

export default App
