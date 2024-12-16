import React from "react";
import { BalanceItem } from "../../types/trading";
import "./Balance.css";

interface BalanceProps {
  balances: BalanceItem[];
}

export const Balance: React.FC<BalanceProps> = ({ balances }) => {
  // Ensure balances is an array before filtering
  const safeBalances = Array.isArray(balances) ? balances : [];

  // Filter out zero balances and sort by non-zero balances first
  const filteredBalances = safeBalances
    .filter((b) => parseFloat(b.balance) > 0)
    .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

  return (
    <div className="balance-card">
      <h2 className="section-title">Account Balance</h2>
      <div className="balance-table">
        <div className="balance-header">
          <span>Asset</span>
          <span>Total</span>
          <span>Available</span>
          <span>In Orders</span>
        </div>
        <div className="balance-body">
          {filteredBalances.length > 0 ? (
            filteredBalances.map((item) => (
              <div key={item.asset} className="balance-row">
                <span className="asset-name">
                  <strong>{item.asset}</strong>
                  <span className="asset-fullname">{item.assetname}</span>
                </span>
                <span>{parseFloat(item.balance).toFixed(item.precision)}</span>
                <span>{parseFloat(item.free).toFixed(item.precision)}</span>
                <span>{parseFloat(item.locked).toFixed(item.precision)}</span>
              </div>
            ))
          ) : (
            <div className="no-balance">No assets with non-zero balance</div>
          )}
        </div>
      </div>
    </div>
  );
};
