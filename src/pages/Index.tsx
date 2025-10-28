import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
}

const mockChats: Chat[] = [
  { id: 1, name: 'Анна Смирнова', lastMessage: 'Отлично, до встречи!', time: '14:23', unread: 2, avatar: '', online: true },
  { id: 2, name: 'Дмитрий Петров', lastMessage: 'Отправил файлы', time: '13:45', unread: 0, avatar: '', online: true },
  { id: 3, name: 'Команда проекта', lastMessage: 'Максим: Готово ✅', time: '12:30', unread: 5, avatar: '', online: false },
  { id: 4, name: 'Мария Козлова', lastMessage: 'Спасибо большое!', time: '11:20', unread: 0, avatar: '', online: false },
  { id: 5, name: 'Александр', lastMessage: 'Созвонимся завтра?', time: 'Вчера', unread: 1, avatar: '', online: true },
];

const mockMessages: Message[] = [
  { id: 1, text: 'Привет! Как дела?', time: '14:20', sent: false },
  { id: 2, text: 'Привет! Всё отлично, спасибо', time: '14:21', sent: true },
  { id: 3, text: 'Ты завтра свободен?', time: '14:22', sent: false },
  { id: 4, text: 'Да, что планируешь?', time: '14:22', sent: true },
  { id: 5, text: 'Отлично, до встречи!', time: '14:23', sent: false },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'status' | 'settings'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        sent: true,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col border-r border-border`}>
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-semibold mb-4">Мессенджер</h1>
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск"
                className="pl-10 bg-secondary border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {activeTab === 'chats' && (
              <div className="divide-y divide-border">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors ${
                      selectedChat?.id === chat.id ? 'bg-secondary' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary font-medium">
                          {chat.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">{chat.name}</span>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground">{chat.unread}</Badge>
                    )}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'calls' && (
              <div className="p-8 text-center text-muted-foreground">
                <Icon name="Phone" size={48} className="mx-auto mb-4 opacity-50" />
                <p>История звонков пуста</p>
              </div>
            )}

            {activeTab === 'status' && (
              <div className="p-8 text-center text-muted-foreground">
                <Icon name="Circle" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нет обновлений статуса</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-4 space-y-2">
                {[
                  { icon: 'User', label: 'Профиль' },
                  { icon: 'Bell', label: 'Уведомления' },
                  { icon: 'Lock', label: 'Конфиденциальность' },
                  { icon: 'Palette', label: 'Оформление' },
                  { icon: 'HelpCircle', label: 'Справка' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full p-4 flex items-center gap-3 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Icon name={item.icon as any} size={24} className="text-primary" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {selectedChat && (
          <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSelectedChat(null)}
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/20 text-primary font-medium">
                  {selectedChat.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold">{selectedChat.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.online ? 'в сети' : 'был(а) недавно'}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Icon name="Phone" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Video" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="MoreVertical" size={20} />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4 bg-secondary/20">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className={`text-xs mt-1 block ${
                        message.sent ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Icon name="Plus" size={24} />
              </Button>
              <Input
                placeholder="Написать сообщение..."
                className="flex-1 bg-secondary border-none"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="ghost" size="icon">
                <Icon name="Smile" size={24} />
              </Button>
              {messageText ? (
                <Button size="icon" onClick={handleSendMessage}>
                  <Icon name="Send" size={20} />
                </Button>
              ) : (
                <Button variant="ghost" size="icon">
                  <Icon name="Mic" size={24} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <nav className="border-t border-border bg-card flex justify-around items-center py-2 md:hidden">
        {[
          { id: 'chats' as const, icon: 'MessageCircle', label: 'Чаты' },
          { id: 'calls' as const, icon: 'Phone', label: 'Звонки' },
          { id: 'status' as const, icon: 'Circle', label: 'Статусы' },
          { id: 'settings' as const, icon: 'Settings', label: 'Настройки' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedChat(null);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name={tab.icon as any} size={24} />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
