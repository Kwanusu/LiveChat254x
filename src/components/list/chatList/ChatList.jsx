import React, { useEffect, useState } from 'react';
import './ChatList.css';
import AddUser from './AddUser';
import { useUserStore } from '../../../lib/UserStore';
import { db } from '../../../lib/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useChatStore } from '../../../lib/chatStore';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");

    const { currentUser } = useUserStore();
    const { chatId,changeChat } = useChatStore();

    const handleSelect = async (chat) => {
       const userChats = chats.map((item) => {
        const { user, ...rest} = item;
        return rest;
       });

       const chatIndex =userChats.findIndex(item => item.chatId === chat.chatId)
       userChats[chatIndex].isSeen = true;

       const userChatRef = doc(db, "userchats", currentUser.id);
       
       try {
        
        await updateDoc(userChatRef, {
            chats: userChats,
            
        }); 
        changeChat(chat.chatId, chat.user);
       } catch (error) {
        console.log(error);
       }    
    };

    const filteredChats = chats.filter((c) => 
        c.user.username.toLowerCase().includes(input.toLowerCase())
    )

    useEffect(() => {
        if (currentUser && currentUser.id) {
            const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
                const items =res.data().chats;
               
                const promises = items.map( async (item) => {
                    const userDocRef = doc(db, 'users', item.receiverId);
                    const userDocSnap = await getDoc(userDocRef);

                    const user = userDocSnap.data()

                    return {...item, user }

                });

                const chatData = await Promise.all(promises)

                setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
            });

            return () => {
                unSub();
            };
        }
    }, [currentUser]);

    console.log(chats);


    return (
        <div className='chatList'>
            <div className='search'>
                <div className='searchBar'>
                    <img src='./search.png' alt='Search' />
                    <input type="text" placeholder='Search' onChange={(e) => setInput(e.target.value)}/>
                </div>
                <img
                    src={addMode ? './minus.png' : './plus.png'}
                    alt={addMode ? 'Minus' : 'Plus'}
                    className='add'
                    onClick={() => setAddMode((prev) => !prev)}
                />
            </div>
            {filteredChats.map((chat) => (
                <div key={chat.chatId} className='item' onClick={() => handleSelect(chat)}
                style={{
                    backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
                }}>
                    <img src={chat.user.blocked.includes(currentUser.id)
                    ?"./avatar.png"
                    :chat.user.avatar ||
                     './avatar.png'} alt='' />
                    <div className='texts'>
                        <span>{chat.user.blocked.includes(currentUser.id)
                        ?"user"
                        : chat.user.username}
                    </span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addMode && <AddUser />}
        </div>
    );
};

export default ChatList;