import { useEffect, useRef, useState, useCallback } from 'react';
import '@n8n/chat/style.css';
import './chat.css';
import { createChat } from '@n8n/chat';
import { UserAnswers } from '../../features/main/types';

interface ChatProps {
  userAnswers?: UserAnswers | null;
}

const Chat = ({ userAnswers }: ChatProps) => {
  const [chatInitialized, setChatInitialized] = useState(false);

  // Create a ref for the chat container element
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Create a persistent ref to track if chat has been initialized
  const hasInitializedChat = useRef(false);

  // Initialize chat function - wrapped in useCallback to prevent recreation
  const initializeChat = useCallback(() => {
    if (hasInitializedChat.current) return; // Prevent multiple initializations

    try {
      // Use the env variables for webhook URL and chat endpoint
      const webhookUrl = `${import.meta.env.VITE_APP_API_SERVER_URL}/${import.meta.env.VITE_APP_CHAT_ENDPOINT}`;

      // Format userAnswers into a simple object format for metadata
      const formattedAnswers = userAnswers
        ? {
            answers: userAnswers.userAnswers.map((answer) => ({
              answer: answer.userAnswer,
              question: answer.question,
            })),
          }
        : undefined;

      // Create chat with properly formatted metadata
      createChat({
        webhookUrl: webhookUrl,
        metadata: formattedAnswers,
      });

      if (formattedAnswers) {
        console.log(
          'Chat initialized with formatted answers:',
          formattedAnswers,
        );
      }

      hasInitializedChat.current = true;
      setChatInitialized(true);
      console.log('Chat initialized successfully');
    } catch (error) {
      console.error('Error initializing n8n chat:', error);
    }
  }, [userAnswers]); // Add userAnswers as dependency

  // Initialize chat when component mounts
  useEffect(() => {
    if (!chatInitialized) {
      initializeChat();
    }
  }, [chatInitialized, initializeChat]);

  return (
    <div
      ref={chatContainerRef}
      className="chat-container flex-grow overflow-auto"
    >
      {/* n8n chat will be mounted here */}
    </div>
  );
};

export default Chat;
