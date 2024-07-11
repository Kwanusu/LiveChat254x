import React from 'react'
import './UserInfo.css'
import {useUserStore} from '../../lib/UserStore'

const UserInfo = () => {

  const { currentUser} = useUserStore()
  return (
    <div className='userinfo'>
        <div className='user'>
          <img src={currentUser.avatar || './avatar.png'} alt=''/>
          <h2>{currentUser.username}</h2>
        </div>
        <div className='icons'>
          <img src='./more.png' alt=''/>
          <img src='./video.png' alt=''/>
          <img src='./edit.png' alt=''/>
        </div>
    </div>
  )
}

export default UserInfo

// import React from 'react';
// import { useUserStore } from '../../lib/UserStore';

// const UserInfo = () => {
//   const { currentUser } = useUserStore();

//   return (
//     <div className="p-5 flex items-center justify-between">
//       <div className="flex items-center gap-5">
//         <img
//           src={currentUser.avatar || './avatar.png'}
//           alt=""
//           className="w-12 h-12 rounded-full object-cover"
//         />
//         <h2>{currentUser.username}</h2>
//       </div>
//       <div className="flex gap-2">
//         <img src="./more.png" alt="" className="w-5 h-5 cursor-pointer" />
//         <img src="./video.png" alt="" className="w-5 h-5 cursor-pointer" />
//         <img src="./edit.png" alt="" className="w-5 h-5 cursor-pointer" />
//       </div>
//     </div>
//   );
// };

// export default UserInfo;
