import { createContext, useContext, useState, useEffect } from 'react';

const ContactContext = createContext();

const CONTACT_MESSAGES_KEY = 'de_contact_messages_v1';

const load = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
  catch { return fallback; }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ } };

export const ContactProvider = ({ children }) => {
  const [contactMessages, setContactMessages] = useState(() => load(CONTACT_MESSAGES_KEY, []));

  useEffect(() => save(CONTACT_MESSAGES_KEY, contactMessages), [contactMessages]);

  const addContactMessage = (formData) => {
    const newMsg = {
      id: `MSG${Date.now()}`,
      name:      formData.name.trim(),
      email:     formData.email.trim(),
      subject:   formData.subject,
      message:   formData.message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'unread', // 'unread' | 'read' | 'replied'
    };
    setContactMessages(prev => [newMsg, ...prev]);
    return newMsg;
  };

  const markMessageRead = (id) => {
    setContactMessages(prev =>
      prev.map(m => m.id === id ? { ...m, status: m.status === 'unread' ? 'read' : m.status } : m)
    );
  };

  const markMessageReplied = (id) => {
    setContactMessages(prev =>
      prev.map(m => m.id === id ? { ...m, status: 'replied' } : m)
    );
  };

  const deleteMessage = (id) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
  };

  const unreadCount = contactMessages.filter(m => m.status === 'unread').length;

  return (
    <ContactContext.Provider value={{
      contactMessages, unreadCount,
      addContactMessage, markMessageRead, markMessageReplied, deleteMessage,
    }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContact must be used within ContactProvider');
  return ctx;
};
