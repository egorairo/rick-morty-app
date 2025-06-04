import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {NetworkContextType} from '../types';

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({children}) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const handleNetworkChange = useCallback((state: NetInfoState) => {
    const hasInternet =
      state.isConnected === true && state.isInternetReachable !== false;
    setIsConnected(hasInternet);
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch();
      handleNetworkChange(state);
      return state.isConnected === true && state.isInternetReachable !== false;
    } catch (error) {
      return false;
    }
  }, [handleNetworkChange]);

  useEffect(() => {
    NetInfo.fetch().then(handleNetworkChange);
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);
    return () => unsubscribe();
  }, [handleNetworkChange]);

  const contextValue: NetworkContextType = {
    isConnected,
    checkConnection,
  };

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};
