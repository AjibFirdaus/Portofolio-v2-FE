/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'react';
import useFetchData from '../hooks/fetchData';

interface Message {
  email: string;
  id: string;
  message: string;
  sender: string;
}

const Messages: React.FC = () => {
  const { data, loading, error } = useFetchData('messages');

  if (loading) return <div className='flex justify-center'><span className="loading loading-bars loading-lg h-screen"></span></div>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !Array.isArray(data) || data.length === 0) return <p>No messages available</p>;

  return (
    <section className="bg-black text-white min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Messages</h1>
        <div className="space-y-4">
          {data.map((message: Message) => (
            <div key={message.id} className="bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-purple-400">{message.sender}</h2>
                <span className="text-sm text-gray-400">{message.email}</span>
              </div>
              <p className="text-gray-300">{message.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Messages;