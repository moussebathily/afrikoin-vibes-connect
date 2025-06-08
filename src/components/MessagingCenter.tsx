
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Video, Users, Plus, Search } from 'lucide-react';
import { Language } from '@/types/language';

interface MessagingCenterProps {
  language: Language;
}

const MessagingCenter: React.FC<MessagingCenterProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('chats');

  const text = {
    fr: {
      title: 'Centre de Messages',
      chats: 'Discussions',
      calls: 'Appels',
      groups: 'Groupes',
      newMessage: 'Nouveau message',
      search: 'Rechercher',
      audioCall: 'Appel audio',
      videoCall: 'Appel vidéo',
      online: 'En ligne',
      lastSeen: 'Vu récemment'
    },
    en: {
      title: 'Messaging Center',
      chats: 'Chats',
      calls: 'Calls',
      groups: 'Groups',
      newMessage: 'New message',
      search: 'Search',
      audioCall: 'Audio call',
      videoCall: 'Video call',
      online: 'Online',
      lastSeen: 'Last seen'
    },
    bm: {
      title: 'Kuma Yɔrɔ',
      chats: 'Kumakan',
      calls: 'Wele',
      groups: 'Gushɛ',
      newMessage: 'Kuma kura',
      search: 'Ɲini',
      audioCall: 'Kumakan wele',
      videoCall: 'Yeli wele',
      online: 'A bɛ yen',
      lastSeen: 'A yera'
    },
    ar: {
      title: 'مركز الرسائل',
      chats: 'المحادثات',
      calls: 'المكالمات',
      groups: 'المجموعات',
      newMessage: 'رسالة جديدة',
      search: 'بحث',
      audioCall: 'مكالمة صوتية',
      videoCall: 'مكالمة فيديو',
      online: 'متصل',
      lastSeen: 'آخر ظهور'
    },
    ti: {
      title: 'መልእኽቲ ማእከል',
      chats: 'ዕላላት',
      calls: 'ደውልታት',
      groups: 'ጉጅለታት',
      newMessage: 'ሓድሽ መልእኽቲ',
      search: 'ድለ',
      audioCall: 'ድምጺ ደውልታ',
      videoCall: 'ቪድዮ ደውልታ',
      online: 'ኣብ መስመር',
      lastSeen: 'ዝሓለፈ'
    },
    pt: {
      title: 'Centro de Mensagens',
      chats: 'Conversas',
      calls: 'Chamadas',
      groups: 'Grupos',
      newMessage: 'Nova mensagem',
      search: 'Pesquisar',
      audioCall: 'Chamada de áudio',
      videoCall: 'Chamada de vídeo',
      online: 'Online',
      lastSeen: 'Visto recentemente'
    },
    es: {
      title: 'Centro de Mensajes',
      chats: 'Chats',
      calls: 'Llamadas',
      groups: 'Grupos',
      newMessage: 'Nuevo mensaje',
      search: 'Buscar',
      audioCall: 'Llamada de audio',
      videoCall: 'Llamada de video',
      online: 'En línea',
      lastSeen: 'Visto recientemente'
    },
    zh: {
      title: '消息中心',
      chats: '聊天',
      calls: '通话',
      groups: '群组',
      newMessage: '新消息',
      search: '搜索',
      audioCall: '语音通话',
      videoCall: '视频通话',
      online: '在线',
      lastSeen: '最近活跃'
    },
    ru: {
      title: 'Центр сообщений',
      chats: 'Чаты',
      calls: 'Звонки',
      groups: 'Группы',
      newMessage: 'Новое сообщение',
      search: 'Поиск',
      audioCall: 'Аудиозвонок',
      videoCall: 'Видеозвонок',
      online: 'В сети',
      lastSeen: 'Был недавно'
    },
    hi: {
      title: 'संदेश केंद्र',
      chats: 'चैट्स',
      calls: 'कॉल्स',
      groups: 'समूह',
      newMessage: 'नया संदेश',
      search: 'खोजें',
      audioCall: 'ऑडियो कॉल',
      videoCall: 'वीडियो कॉल',
      online: 'ऑनलाइन',
      lastSeen: 'हाल ही में देखा'
    }
  };

  const mockChats = [
    { id: 1, name: 'Aminata Traore', lastMessage: 'Bonjour, comment allez-vous?', time: '10:30', online: true, avatar: '👩🏾' },
    { id: 2, name: 'Moussa Diallo', lastMessage: 'À bientôt!', time: '09:15', online: false, avatar: '👨🏿' },
    { id: 3, name: 'Fatou Kone', lastMessage: 'Merci beaucoup', time: 'Hier', online: true, avatar: '👩🏾' }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{text[language].title}</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            {/* En-tête avec onglets */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-4">
                <Button
                  variant={activeTab === 'chats' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('chats')}
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{text[language].chats}</span>
                </Button>
                <Button
                  variant={activeTab === 'calls' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('calls')}
                  className="flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{text[language].calls}</span>
                </Button>
                <Button
                  variant={activeTab === 'groups' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('groups')}
                  className="flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>{text[language].groups}</span>
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="default" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  {text[language].newMessage}
                </Button>
              </div>
            </div>

            {/* Liste des conversations */}
            <div className="space-y-3">
              {mockChats.map((chat) => (
                <div key={chat.id} className="flex items-center p-4 rounded-lg border hover:bg-muted transition-colors cursor-pointer">
                  <div className="relative mr-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{chat.name}</h3>
                      <span className="text-sm text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    <p className="text-xs text-green-500 mt-1">
                      {chat.online ? text[language].online : text[language].lastSeen}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MessagingCenter;
