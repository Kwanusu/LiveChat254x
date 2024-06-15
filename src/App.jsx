import './App.css';
import List from './components/list/List';
import Chat from './components/chat/Chat';
import Detail from './components/detail/Detail';
import Login from './components/Login/Login';
import Notification from './components/notification/Notification';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase'; 
import { useUserStore } from './lib/UserStore';
import { useChatStore } from './lib/chatStore';

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed, user:', user); // Debugging line
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    }
  }, [fetchUserInfo]);

  console.log('currentUser:', currentUser); // Debugging line

  if (isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className='container'>
      {
        currentUser ? (
          <div>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </div>
        ) : (
          <Login />
        )
      }
      <Notification />
    </div>
  );
}

export default App;
