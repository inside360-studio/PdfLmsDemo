import { useEffect, useRef, useState, useCallback } from 'react';
import '@n8n/chat/style.css';
import './chat.css';
import { createChat } from '@n8n/chat';
import { UserAnswers } from '../../features/main/types';
import { FeedbackResponse } from '../../features/main/mainApi';

interface ChatProps {
  userAnswers?: UserAnswers | null;
  feedbackData?: FeedbackResponse;
}

const Chat = ({ userAnswers, feedbackData }: ChatProps) => {
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

      // Format and merge userAnswers and feedback into metadata
      const formattedAnswers = userAnswers
        ? {
            answers: userAnswers.userAnswers.map((answer) => {
              const feedbackItem = feedbackData?.feedback.find(
                (item) => item.question === answer.question,
              );
              return {
                question: answer.question,
                answer: answer.userAnswer,
                isCorrect: feedbackItem?.isCorrect,
                feedback: feedbackItem?.feedback,
              };
            }),
          }
        : undefined;

      // Create chat with properly formatted metadata
      createChat({
        webhookUrl: webhookUrl,
        metadata: formattedAnswers,
        initialMessages: [
          'Hi there! 👋',
          'My name is Emma. Do you have any questions regarding the training?',
        ],
        i18n: {
          en: {
            title: 'Hi there! 👋',
            subtitle: 'I am available 24/7 and I am multi-lingual',
            footer: '',
            getStarted: 'New Conversation',
            inputPlaceholder: 'Type your question..',
            closeButtonTooltip: 'Close chat',
          },
        },
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
  }, [userAnswers, feedbackData]); // Add feedbackData as dependency

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
