import { create } from 'zustand'
import { useUserStore } from './UserStore';


export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    if (user.blocked.includes(currentUser.id)) {
      set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      set({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },
  
  changeBlock: () => {
    set(state => ({ ...state,isReceiverBlocked: !state.isReceiverBlocked }));
  }
}));


