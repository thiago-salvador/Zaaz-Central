export interface Chat {
  id: string;
  title: string;
  date: string;
  userId: string;
}

export interface ChatHistoryProps {
  onSelectChat: (chatId: string | null) => void;
  onDeleteChat: (chatId: string) => void;
  currentChatId: string | null;
  chats: Chat[];
  onNewChat: () => void;
}
