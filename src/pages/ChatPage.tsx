import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import PhoneFrame from '../components/PhoneFrame';
import Header from '../components/Header';
import ChatMessage, { Message } from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import axios from 'axios'; // Importe o axios

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Como você tem se sentido ultimamente?',
    sender: 'eco',
  },
];

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // COMENTE A LINHA ABAIXO PARA TESTAR SE O ERRO PERSISTE
      // const response = await axios.post('http://localhost:3001/api/chat', { mensagem: text });
      setIsLoading(false);

      // if (response.data.resposta) {
      //   const ecoResponseMessage: Message = {
      //     id: Date.now().toString(),
      //     text: response.data.resposta,
      //     sender: 'eco',
      //   };
      //   setMessages((prev) => [...prev, ecoResponseMessage]);
      // } else {
      //   setError('Resposta da IA inválida.');
      // }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Erro ao enviar mensagem para o backend:', error.response?.data?.error || error.message);
      setError('Falha ao obter resposta da IA.');
    }
  };

  const goToVoiceMode = () => {
    navigate('/voice');
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header title="ECO" showBackButton={false} />

        <div className="flex-1 overflow-y-auto p-4">
          {/* COMENTE A LINHA ABAIXO PARA TESTAR */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <div className="text-gray-500 animate-pulse">Carregando resposta...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 flex justify-center">
          <motion.button
            onClick={goToVoiceMode}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic size={24} />
          </motion.button>
        </div>

        {/* COMENTE A LINHA ABAIXO PARA TESTAR */}
        {/* <ChatInput onSendMessage={handleSendMessage} /> */}
      </div>
    </PhoneFrame>
  );
};

export default ChatPage;