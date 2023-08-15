import { createContext, useContext } from 'react';

export interface AppContextType {
  locale: string;
  storeHash: string;
  context: string;
}

export const AppContext = createContext<AppContextType>({
  locale: '',
  storeHash: '',
  context: '',
});

export const useAppContext = () => useContext(AppContext);
