import React, { createContext, useContext } from 'react';

const EmailContext = createContext();

export const useEmail = () => useContext(EmailContext);

export const EmailProvider = ({ children }) => {
  
  const sendEmail = async (data) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Qualcosa è andato storto.');
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending email:', error);
      return { error: error.message };
    }
  };

  const value = {
    sendEmail,
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
};