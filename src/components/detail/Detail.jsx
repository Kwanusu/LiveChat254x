import React from 'react';
import { auth, db } from '../../lib/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../../lib/UserStore';
import { useChatStore } from '../../lib/chatStore';

const Detail = () => {
  const { chatId, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();  

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" className="img" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit, amet</p>
      </div>
      <div className="p-5 flex flex-col gap-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
          </div>
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img src="" alt="" className="w-10 h-10 rounded-md object-cover" />
                <span className="text-sm text-gray-400 font-light">photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img src="" alt="" className="w-10 h-10 rounded-md object-cover" />
                <span className="text-sm text-gray-400 font-light">photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
          </div>
        </div>
        <button 
          onClick={handleBlock} 
          className="py-4 px-5 bg-red-600/70 text-white rounded-md cursor-pointer hover:bg-red-600/90"
        >
          {isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User blocked" : "Block User"}
        </button>
        <button 
          className="py-3 px-5 bg-blue-600 text-white rounded-md cursor-pointer" 
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;

// import React from 'react';
// import { auth, db } from '../../lib/firebase';
// import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
// import { useUserStore } from '../../lib/UserStore';
// import { useChatStore } from '../../lib/chatStore';

// const Detail = () => {
//   const { chatId, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
//   const { currentUser } = useUserStore();  

//   const handleBlock = async () => {
//     if (!user) return;

//     const userDocRef = doc(db, "users", currentUser.id);

//     try {
//       await updateDoc(userDocRef, {
//         blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
//       });
//       changeBlock();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex-1 p-8 bg-[rgba(17,25,40,0.781)] rounded-lg absolute inset-0 m-auto">
//       <div className="flex flex-col items-center gap-2 border-b border-gray-300/35 p-6">
//         <img src={user?.avatar || "./avatar.png"} alt="" className="w-15 h-15 rounded-full object-cover" />
//         <h2>{user?.username}</h2>
//         <p>Lorem ipsum dolor sit, amet</p>
//       </div>
//       <div className="p-5 flex flex-col gap-6">
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//             <span>Chat Settings</span>
//             <img src="./arrowUp.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//             <span>Privacy & help</span>
//             <img src="./arrowUp.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//             <span>Shared photos</span>
//             <img src="./arrowDown.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
//           </div>
//           <div className="flex flex-col gap-5 mt-5">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-5">
//                 <img src="" alt="" className="w-10 h-10 rounded-md object-cover" />
//                 <span className="text-sm text-gray-400 font-light">photo_2024_2.png</span>
//               </div>
//               <img src="./download.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-5">
//                 <img src="" alt="" className="w-10 h-10 rounded-md object-cover" />
//                 <span className="text-sm text-gray-400 font-light">photo_2024_2.png</span>
//               </div>
//               <img src="./download.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
//             </div>
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//             <span>Shared Files</span>
//             <img src="./arrowUp.png" alt="" className="w-7 h-7 bg-[rgba(17,25,40,0.5)] p-2 rounded-full cursor-pointer" />
//           </div>
//         </div>
//         <button 
//           onClick={handleBlock} 
//           className="py-4 px-5 bg-red-600/70 text-white rounded-md cursor-pointer hover:bg-red-600/90"
//         >
//           {isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User blocked" : "Block User"}
//         </button>
//         <button 
//           className="py-3 px-5 bg-blue-600 text-white rounded-md cursor-pointer" 
//           onClick={() => auth.signOut()}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Detail;

