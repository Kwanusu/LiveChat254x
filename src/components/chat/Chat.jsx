import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import EmojiPicker from 'emoji-picker-react';
import { db } from '../../lib/firebase';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/UserStore';
import upload from '../../lib/upload';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { chatId } = useChatStore();
  const { currentUser, user, isCurrentUserBlocked, 
    isReceiverBlocked, } = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
        setChat(res.data());
      });
      return () => {
        unSub();
      };
    }
  }, [chatId]);

  const handleEmoji = (e, emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
        setImg({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        });
    }
};
  const handleSend = async (e) => {
    e.preventDefault();
    if (text === "") return;

    let imgUrl = null;

    try {

        if (img.file){
            imgUrl = await upload(img.file); 
        }

        await updateDoc(doc(db, "chats", chatId), {
            messages: arrayUnion({
                senderId: currentUser.id,
                text,
                createdAt: new Date(),
                ...(imgUrl && {img: imgUrl}),  
            }),
        });

        const userIDs = [currentUser.id, user.id];

        userIDs.forEach(async (id) => {

        const userChatRef = doc(db, "userchats", id); 
        const userChatsSnapshot = await getDoc(userChatRef);
        
        if (userChatsSnapshot.exists()){
            const userChatsData = userChatsSnapshot.data();

            const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen = 
            id === currentUser ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatRef, {
                chats: userChatsData.chats,

            });

        }
    });
    } catch (error) {
      console.log(error)  
    }

    setImg({
        file: null,
        url: "",
    });

    setText("");
  }

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src={user?.avatar || './avatar.png'} alt='' />
          <div className='texts'>
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit amet </p>
          </div>
        </div>
        <div className='icons'>
          <img src='./phone.png' alt='' />
          <img src='./video.png' alt='' />
          <img src='./info.png' alt='' />
        </div>
      </div>
      <div className='center'>
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ?
           "message own" : "message"} key={message?.createdAt}>
            <div className='texts'>
                {message.img && <img
                src={message.img}
                alt=""
                />}
              <p>{message.text}</p>
              <span>{message.timestamp}</span>
            </div>
          </div>
        ))}
        {img.url && (<div className="message own">
            <div className="texts">
                <img src={img.url} alt="" />
            </div>
        </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className='bottom'>
        <div className='icons'>
            <label htmlFor="">
          <img src='./img.png' alt='' />
          </label>
          <input type="file" id='file' style={{display:"none"}} onChange={handleImg} />
          <img src='./camera.png' alt='' />
          <img src='./mic.png' alt='' />
        </div>
        <input
          type='text'
          placeholder={ isCurrentUserBlocked || 
            isReceiverBlocked ? "You can't send message" : "Type a message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={ isCurrentUserBlocked || 
          isReceiverBlocked}/>
        <div className='emoji'>
          <img
            src='./emoji.png'
            alt=''
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className='picker'>
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button className='sendButton' onClick={handleSend} disabled= { isCurrentUserBlocked || 
    isReceiverBlocked}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

// import React, { useEffect, useRef, useState } from 'react';
// import EmojiPicker from 'emoji-picker-react';
// import { db } from '../../lib/firebase';
// import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
// import { useChatStore } from '../../lib/chatStore';
// import { useUserStore } from '../../lib/UserStore';
// import upload from '../../lib/upload';

// const Chat = () => {
//   const [chat, setChat] = useState();
//   const [open, setOpen] = useState(false);
//   const [text, setText] = useState("");
//   const [img, setImg] = useState({
//     file: null,
//     url: "",
//   });

//   const { chatId } = useChatStore();
//   const { currentUser, user, isCurrentUserBlocked, isReceiverBlocked } = useUserStore();

//   const endRef = useRef(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, []);

//   useEffect(() => {
//     if (chatId) {
//       const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
//         setChat(res.data());
//       });
//       return () => {
//         unSub();
//       };
//     }
//   }, [chatId]);

//   const handleEmoji = (e, emojiObject) => {
//     setText((prev) => prev + emojiObject.emoji);
//     setOpen(false);
//   };

//   const handleImg = (e) => {
//     if (e.target.files[0]) {
//       setImg({
//         file: e.target.files[0],
//         url: URL.createObjectURL(e.target.files[0])
//       });
//     }
//   };

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (text === "") return;

//     let imgUrl = null;

//     try {
//       if (img.file) {
//         imgUrl = await upload(img.file);
//       }

//       await updateDoc(doc(db, "chats", chatId), {
//         messages: arrayUnion({
//           senderId: currentUser.id,
//           text,
//           createdAt: new Date(),
//           ...(imgUrl && { img: imgUrl }),
//         }),
//       });

//       const userIDs = [currentUser.id, user.id];

//       userIDs.forEach(async (id) => {
//         const userChatRef = doc(db, "userchats", id);
//         const userChatsSnapshot = await getDoc(userChatRef);

//         if (userChatsSnapshot.exists()) {
//           const userChatsData = userChatsSnapshot.data();

//           const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

//           userChatsData.chats[chatIndex].lastMessage = text;
//           userChatsData.chats[chatIndex].isSeen = id === currentUser ? true : false;
//           userChatsData.chats[chatIndex].updatedAt = Date.now();

//           await updateDoc(userChatRef, {
//             chats: userChatsData.chats,
//           });
//         }
//       });
//     } catch (error) {
//       console.log(error);
//     }

//     setImg({
//       file: null,
//       url: "",
//     });

//     setText("");
//   }

//   return (
//     <div className='flex-2 border-x border-gray-300/35 h-full flex flex-col'>
//       <div className='p-5 flex items-center justify-between border-b border-gray-300/35'>
//         <div className='flex items-center gap-5'>
//           <img src={user?.avatar || './avatar.png'} alt='' className='w-15 h-15 rounded-full object-cover' />
//           <div className='flex flex-col gap-1'>
//             <span className='text-lg font-bold'>{user?.username}</span>
//             <p className='text-sm font-light text-gray-400'>Lorem ipsum dolor sit amet</p>
//           </div>
//         </div>
//         <div className='flex gap-5'>
//           <img src='./phone.png' alt='' className='w-5 h-5' />
//           <img src='./video.png' alt='' className='w-5 h-5' />
//           <img src='./info.png' alt='' className='w-5 h-5' />
//         </div>
//       </div>
//       <div className='flex-1 p-5 overflow-scroll flex flex-col gap-5'>
//         {chat?.messages?.map((message) => (
//           <div className={message.senderId === currentUser?.id ? "self-end flex gap-5" : "flex gap-5"} key={message?.createdAt}>
//             <img src={message.img} alt="" className='w-7 h-7 rounded-full object-cover' />
//             <div className='flex flex-col gap-1 flex-1'>
//               {message.img && <img src={message.img} alt="" className='w-full h-75 rounded-md object-cover' />}
//               <p className={`p-5 rounded-md ${message.senderId === currentUser?.id ? 'bg-blue-500' : 'bg-[rgba(17,25,40,0.3)]'}`}>
//                 {message.text}
//               </p>
//               <span className='text-xs'>{message.timestamp}</span>
//             </div>
//           </div>
//         ))}
//         {img.url && (
//           <div className="self-end flex gap-5">
//             <div className="flex flex-col gap-1 flex-1">
//               <img src={img.url} alt="" className='w-full h-75 rounded-md object-cover' />
//             </div>
//           </div>
//         )}
//         <div ref={endRef}></div>
//       </div>
//       <div className='p-5 flex items-center justify-between border-t border-gray-300/35 gap-5 mt-auto'>
//         <div className='flex gap-5'>
//           <label htmlFor="file">
//             <img src='./img.png' alt='' className='w-5 h-5 cursor-pointer' />
//           </label>
//           <input type="file" id='file' className='hidden' onChange={handleImg} />
//           <img src='./camera.png' alt='' className='w-5 h-5 cursor-pointer' />
//           <img src='./mic.png' alt='' className='w-5 h-5 cursor-pointer' />
//         </div>
//         <input
//           type='text'
//           placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You can't send message" : "Type a message..."}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           disabled={isCurrentUserBlocked || isReceiverBlocked}
//           className='flex-1 bg-[rgba(17,25,40,0.5)] border-none text-white outline-none p-5 rounded-md text-lg'
//         />
//         <div className='relative'>
//           <img
//             src='./emoji.png'
//             alt=''
//             onClick={() => setOpen((prev) => !prev)}
//             className='w-5 h-5 cursor-pointer'
//           />
//           {open && (
//             <div className='absolute bottom-12 left-0'>
//               <EmojiPicker onEmojiClick={handleEmoji} />
//             </div>
//           )}
//         </div>
//         <button
//           className={`bg-blue-500 text-white p-3 rounded-md cursor-pointer ${isCurrentUserBlocked || isReceiverBlocked ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-600'}`}
//           onClick={handleSend}
//           disabled={isCurrentUserBlocked || isReceiverBlocked}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
