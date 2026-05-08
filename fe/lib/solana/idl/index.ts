import idl from "./solpay.json";
import type { Idl } from "@coral-xyz/anchor";

export const SOLPAY_IDL = idl as Idl;
export type SolpayIdlJson = typeof idl;
