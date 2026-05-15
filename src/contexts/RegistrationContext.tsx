/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

interface RegistrationContextValue {
  selectedBoard: string;
  setSelectedBoard: (board: string) => void;
}

const RegistrationContext = createContext<RegistrationContextValue>({
  selectedBoard: 'random',
  setSelectedBoard: () => {},
});

export function RegistrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedBoard, setSelectedBoard] = useState('random');
  return (
    <RegistrationContext.Provider value={{ selectedBoard, setSelectedBoard }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  return useContext(RegistrationContext);
}
