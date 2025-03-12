import { useEffect, useRef, useState, useCallback } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { useChatFileUpload } from './chatApi';

interface ChatProps {
  uploadedFile: File | null;
}

const Chat = ({ uploadedFile }: ChatProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatInitialized, setChatInitialized] = useState(false);
  // Create a persistent ref to track if we've already uploaded the file
  const hasUploadedFile = useRef(false);

  // Create a persistent ref to track if chat has been initialized
  const hasInitializedChat = useRef(false);

  // Initialize chat function - wrapped in useCallback to prevent recreation
  const initializeChat = useCallback(() => {
    if (hasInitializedChat.current) return; // Prevent multiple initializations

    try {
      // Use the env variables for webhook URL and chat endpoint
      const webhookUrl = `${import.meta.env.VITE_APP_API_SERVER_URL}/${import.meta.env.VITE_APP_CHAT_ENDPOINT}`;
      createChat({
        webhookUrl: webhookUrl,
      });
      hasInitializedChat.current = true;
      setChatInitialized(true);
      console.log('Chat initialized successfully');
    } catch (error) {
      console.error('Error initializing n8n chat:', error);
    }
  }, []); // No dependencies to avoid re-creation

  // Use the mutation hook to upload the file
  const { mutate: uploadFileToChatAPI, isLoading } = useChatFileUpload({
    onSuccess: (result) => {
      console.log('File successfully uploaded to chat API:', result);
      // Initialize n8n chat after successful file upload
      initializeChat();
    },
    onError: (error) => {
      console.error('Error uploading file to chat API:', error);
    },
  });

  // Upload the file only once when component mounts
  useEffect(() => {
    // Only execute this effect once when uploadedFile is available
    const shouldUpload =
      uploadedFile &&
      !chatInitialized &&
      !isLoading &&
      !hasUploadedFile.current;

    if (shouldUpload) {
      console.log('Uploading file to chat API:', uploadedFile);

      // Set the flag before uploading to prevent duplicate uploads
      hasUploadedFile.current = true;
      uploadFileToChatAPI(uploadedFile);
    }
  }, [uploadedFile, chatInitialized, isLoading, uploadFileToChatAPI]); // Include all dependencies

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg z-50">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-blue-600">
          <h2 className="text-white font-semibold">Chat</h2>
          {isLoading && (
            <span className="text-xs text-white ml-2">Preparing chat...</span>
          )}
        </div>
        <div
          ref={chatContainerRef}
          className="chat-container flex-grow overflow-auto"
        >
          {/* n8n chat will be mounted here */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
