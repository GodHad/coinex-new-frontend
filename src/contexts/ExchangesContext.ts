"use client"
import { ExchangesData } from "@/types/exchanges-data";
import { createContext } from "react";

type ExchangesDataContextType = {
    prevExchanges: ExchangesData | null;
    setPrevExchanges: (value: ExchangesData | null) => void;
};

const ExchangesDataContext = createContext<ExchangesDataContextType>({
    prevExchanges: null, 
    setPrevExchanges: () => {} // This is a placeholder function
});

export default ExchangesDataContext;
