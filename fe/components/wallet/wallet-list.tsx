import type { Wallet } from "@/types";
import { WalletCard } from "./wallet-card";

export function WalletList({ wallets }: { wallets: Wallet[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {wallets.map((w) => (
        <li key={w.id} id={w.id}>
          <WalletCard wallet={w} />
        </li>
      ))}
    </ul>
  );
}
