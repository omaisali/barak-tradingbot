import { useState, useEffect } from "react";
import { socket } from "./useSocket";
import { BalanceItem } from "../types/trading";

export const useBalance = () => {
  const [balances, setBalances] = useState<BalanceItem[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleBalance = (data: any) => {
      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setBalances(data);
      } else {
        console.error("Invalid balance data format:", data);
        setBalances([]);
      }
    };

    socket.on("balance", handleBalance);
    socket.emit("get-balance");

    const interval = setInterval(() => {
      socket.emit("get-balance");
    }, 30000); // Update every 30 seconds

    return () => {
      socket.off("balance", handleBalance);
      clearInterval(interval);
    };
  }, []);

  return balances;
};
