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

    const handleSelect = async (selectedChat) => {
        const updatedChats = chats.map((chat) => {
          if (chat.chatId === selectedChat.chatId) {
            return {
              ...chat,
              isSeen: true, // Update isSeen for the selected chat
            };
          }
          return chat;
        });
      
        const userChatRef = doc(db, "userchats", currentUser.id);
      
        try {
          await updateDoc(userChatRef, {
            chats: updatedChats,
          });
          
          changeChat(selectedChat.chatId, selectedChat.user);
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

// import React, { useEffect, useState } from 'react';
// import AddUser from './AddUser';
// import { useUserStore } from '../../../lib/UserStore';
// import { db } from '../../../lib/firebase';
// import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
// import { useChatStore } from '../../../lib/chatStore';

// const ChatList = () => {
//     const [chats, setChats] = useState([]);
//     const [addMode, setAddMode] = useState(false);
//     const [input, setInput] = useState("");

//     const { currentUser } = useUserStore();
//     const { chatId, changeChat } = useChatStore();

//     const handleSelect = async (chat) => {
//         const userChats = chats.map((item) => {
//             const { user, ...rest } = item;
//             return rest;
//         });

//         const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);
//         userChats[chatIndex].isSeen = true;

//         const userChatRef = doc(db, "userchats", currentUser.id);

//         try {
//             await updateDoc(userChatRef, {
//                 chats: userChats,
//             });
//             changeChat(chat.chatId, chat.user);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const filteredChats = chats.filter((c) =>
//         c.user.username.toLowerCase().includes(input.toLowerCase())
//     );

//     useEffect(() => {
//         if (currentUser && currentUser.id) {
//             const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
//                 const items = res.data().chats;

//                 const promises = items.map(async (item) => {
//                     const userDocRef = doc(db, 'users', item.receiverId);
//                     const userDocSnap = await getDoc(userDocRef);

//                     const user = userDocSnap.data();

//                     return { ...item, user };
//                 });

//                 const chatData = await Promise.all(promises);

//                 setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
//             });

//             return () => {
//                 unSub();
//             };
//         }
//     }, [currentUser]);

//     console.log(chats);

//     return (
//         <div className="flex-1 overflow-scroll">
//             <div className="flex items-center p-5 gap-5">
//                 <div className="flex-1 bg-[rgba(17,25,40,0.5)] flex items-center gap-5 rounded-lg p-5">
//                     <img src="./search.png" alt="Search" className="w-5 h-5" />
//                     <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)} className="bg-transparent border-none text-white flex-1" />
//                 </div>
//                 <img
//                     src={addMode ? './minus.png' : './plus.png'}
//                     alt={addMode ? 'Minus' : 'Plus'}
//                     className="w-9 h-9 bg-[rgba(17,25,40,0.5)] p-2 rounded-lg cursor-pointer"
//                     onClick={() => setAddMode((prev) => !prev)}
//                 />
//             </div>
//             {filteredChats.map((chat) => (
//                 <div key={chat.chatId} className="flex gap-5 items-center p-5 cursor-pointer border-b border-b-[#dddddd35]" onClick={() => handleSelect(chat)}
//                     style={{
//                         backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
//                     }}>
//                     <img src={chat.user.blocked.includes(currentUser.id)
//                         ? "./avatar.png"
//                         : chat.user.avatar ||
//                         './avatar.png'} alt='' className="w-12 h-12 rounded-full object-cover" />
//                     <div className="flex flex-col gap-2">
//                         <span className="font-medium">{chat.user.blocked.includes(currentUser.id) ? "user" : chat.user.username}</span>
//                         <p className="text-sm font-light">{chat.lastMessage}</p>
//                     </div>
//                 </div>
//             ))}
//             {addMode && <AddUser />}
//         </div>
//     );
// };

// export default ChatList;
