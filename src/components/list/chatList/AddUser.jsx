import React, { useState } from 'react';
import "./AddUser.css";
import { db } from '../../../lib/firebase';
import { 
  query, 
  collection, 
  where, 
  getDocs, 
  setDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  arrayUnion 
} from 'firebase/firestore';
import { useUserStore } from '../../../lib/UserStore';

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    console.log(name)
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async(e) => {
    e.preventDefault();

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input type="text" name="username" placeholder='Username' />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;

// import React, { useState } from 'react';
// import { db } from '../../../lib/firebase';
// import { 
//   query, 
//   collection, 
//   where, 
//   getDocs, 
//   setDoc, 
//   serverTimestamp, 
//   doc, 
//   updateDoc, 
//   arrayUnion 
// } from 'firebase/firestore';
// import { useUserStore } from '../../../lib/UserStore';

// const AddUser = () => {
//   const [user, setUser] = useState(null);
//   const { currentUser } = useUserStore();

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const username = formData.get("username");
//     try {
//       const userRef = collection(db, "users");
//       const q = query(userRef, where("username", "==", username));

//       const querySnapShot = await getDocs(q);

//       if (!querySnapShot.empty) {
//         setUser(querySnapShot.docs[0].data());
//       }
      
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleAdd = async(e) => {
//     e.preventDefault();

//     const chatRef = collection(db, "chats");
//     const userChatsRef = collection(db, "userchats");

//     try {
//       const newChatRef = doc(chatRef);
      
//       await setDoc(newChatRef, {
//         createdAt: serverTimestamp(),
//         messages: [],
//       });

//       await updateDoc(doc(userChatsRef, user.id), {
//         chats: arrayUnion({
//           chatId: newChatRef.id,
//           lastMessage: "",
//           receiverId: currentUser.id,
//           updatedAt: Date.now(),
//         }),
//       });
//       await updateDoc(doc(userChatsRef, currentUser.id), {
//         chats: arrayUnion({
//           chatId: newChatRef.id,
//           lastMessage: "",
//           receiverId: user.id,
//           updatedAt: Date.now(),
//         }),
//       });

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="w-max h-max p-8 bg-[rgba(17,25,40,0.781)] rounded-lg absolute inset-0 m-auto">
//       <form onSubmit={handleSearch} className="flex gap-5">
//         <input type="text" name="username" placeholder="Username" className="p-5 rounded-lg border-none outline-none" />
//         <button className="p-5 rounded-lg bg-blue-600 text-white border-none cursor-pointer">Search</button>
//       </form>
//       {user && (
//         <div className="user mt-12 flex items-center justify-between">
//           <div className="detail flex gap-5 items-center">
//             <img src={user.avatar || "./avatar.png"} alt="" className="w-12 h-12 rounded-full object-cover" />
//             <span>{user.username}</span>
//           </div>
//           <button onClick={handleAdd} className="p-2 rounded-lg bg-blue-600 text-white border-none cursor-pointer">Add User</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddUser;

