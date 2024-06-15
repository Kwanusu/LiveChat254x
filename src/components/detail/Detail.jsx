import React from 'react'
import './Detail.css'
import { auth, db } from '../../lib/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../../lib/UserStore';
import { useChatStore } from '../../lib/chatStore';


const Detail = () => {
  const { chatId, isCurrentUserBlocked, 
    isReceiverBlocked, changeBock} = useChatStore();
  const { currentUser} = useUserStore();  

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked? 
        arrayRemove(user.id) : 
        arrayUnion(user.id),
      });
      changeBock()
    } catch (error) {
      console.log(error)
    }
  }
    return (
      <div className="detail">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <h2>{user?.username}</h2>
          <p>Lorem ipsum dolor sit, amet</p>
        </div>
        <div className="info">
          <div className="option">
            <div className="title">
              <span>Chat Settings</span>
              <img src="./arrowUp.png" alt="" />
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Privacy & help</span>
              <img src="./arrowUp.png" alt="" />
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Shared photos</span>
              <img src="./arrowDown.png" alt="" />
            </div>
            <div className="photos">
              <div className="photoItem">
                <div className="photoDetail">
                  <img src="" alt="" />
                  <span>photo_2024_2.png</span>
                </div>
                <img src="./download.png" alt="" className='icon'/>
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img src="" alt="" />
                  <span>photo_2024_2.png</span>
                </div>
                <img src="./download.png" alt="" className='icon'/>
              </div>
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Shared Files</span>
              <img src="./arrowUp.png" alt="" />
            </div>
          </div>
          <button onClick={handleBlock}>
            {isCurrentUserBlocked ? 
            "You are Blocked" : 
            isReceiverBlocked ? 
            "User blocked" : 
            "Block User"}
          </button>
          <button className='logout' onClick={() =>auth.signOut()}>Logout</button>
        </div>
      </div>
    );
  }
  

export default Detail