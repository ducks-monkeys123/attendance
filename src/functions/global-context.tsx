// GlobalContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { FormParameters, GatheringTimes, User } from '../types/types';

const GlobalContext = createContext<any>(null);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [formParameters, setFormParameters] = useState<FormParameters | null>(null);
    const [gatherings, setGatherings] = useState<GatheringTimes[] | null>(null);
    const [defaultGathering, setDefaultGathering] = useState<GatheringTimes[] | null>(null);

    return (
    <GlobalContext.Provider value={{ 
        user, 
        setUser, 
        formParameters, 
        setFormParameters, 
        gatherings, 
        setGatherings,
        defaultGathering, 
        setDefaultGathering
    }}>

        {children}
    </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
