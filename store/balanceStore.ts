import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./mmkv-storage";

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
}

export interface BalanceState {
  transaction: Array<Transaction>;
  runTransaction: (transaction: Transaction) => void;
  balance: () => number;
  clearTransactions: () => void;
}

export const useBalanceStore = create<BalanceState>()(
    persist((set,get)=>({
        transaction:[],
        runTransaction:(transaction:Transaction)=>{
            set((state)=>({transaction:[...state.transaction,transaction]}))
        },
        balance:()=>get().transaction.reduce((acc,curr)=>acc+curr.amount,0),
        clearTransactions:()=>set({transaction:[]})
    }),{
        name:"balance",
        storage:createJSONStorage(()=>zustandStorage)
    })
)
