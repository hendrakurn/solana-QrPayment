import type { PaymentDraft } from "@/types";
import { mockPaymentDraft } from "@/data/payment";

interface QrisTag {
  id: string;
  value: string;
}

function parseTLV(payload: string): QrisTag[] {
  const tags: QrisTag[] = [];
  let i = 0;
  while (i < payload.length - 4) {
    const id = payload.slice(i, i + 2);
    const lenStr = payload.slice(i + 2, i + 4);
    const len = Number.parseInt(lenStr, 10);
    if (Number.isNaN(len)) break;
    const value = payload.slice(i + 4, i + 4 + len);
    if (value.length !== len) break;
    tags.push({ id, value });
    i += 4 + len;
  }
  return tags;
}

function findTag(tags: QrisTag[], id: string): string | undefined {
  return tags.find((t) => t.id === id)?.value;
}

const TITLE_CASE_EXCEPTIONS = new Set(["DAN", "&"]);

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => {
      if (!w) return w;
      const upper = w.toUpperCase();
      if (TITLE_CASE_EXCEPTIONS.has(upper)) return w;
      return w[0].toUpperCase() + w.slice(1);
    })
    .join(" ")
    .trim();
}

/**
 * Decode an EMV/QRIS payload into a PaymentDraft. Falls back to the mock
 * draft for any field that can't be extracted, so downstream UI never has
 * to handle missing data. Static QRIS (no amount) keeps the mock amount.
 */
export function parseQrisPayload(raw: string): PaymentDraft {
  const trimmed = raw.trim();
  // Heuristic: real QRIS starts with "00020101" (Payload Format Indicator + POI)
  if (!/^\d{4}/.test(trimmed)) {
    return mockPaymentDraft;
  }

  try {
    const tags = parseTLV(trimmed);
    const merchantNameRaw = findTag(tags, "59");
    const merchantCityRaw = findTag(tags, "60");
    const amountRaw = findTag(tags, "54");
    const currency = findTag(tags, "53");

    // QRIS NMID lives inside one of the merchant account templates 26..45.
    // The templates are themselves TLV; tag 02 within them is the merchant ID.
    let qrisId: string | undefined;
    for (const t of tags) {
      const idNum = Number.parseInt(t.id, 10);
      if (idNum >= 26 && idNum <= 45) {
        const sub = parseTLV(t.value);
        const candidate = findTag(sub, "02") || findTag(sub, "01");
        if (candidate) {
          qrisId = candidate;
          break;
        }
      }
    }

    const merchantName = merchantNameRaw
      ? titleCase(merchantNameRaw)
      : mockPaymentDraft.merchant.name;
    const merchantCity = merchantCityRaw
      ? titleCase(merchantCityRaw)
      : mockPaymentDraft.merchant.city;

    let amountIdr = mockPaymentDraft.amountIdr;
    if (amountRaw) {
      const parsed = Number.parseFloat(amountRaw);
      if (Number.isFinite(parsed) && parsed > 0) {
        amountIdr = Math.round(parsed);
      }
    }

    return {
      merchant: {
        name: merchantName,
        category: mockPaymentDraft.merchant.category,
        city: merchantCity,
        qrisId: qrisId || trimmed.slice(0, 16),
        verified: currency === "360",
      },
      amountIdr,
      recommendedWalletId: mockPaymentDraft.recommendedWalletId,
      rate: mockPaymentDraft.rate,
      feeIdr: mockPaymentDraft.feeIdr,
    };
  } catch {
    return mockPaymentDraft;
  }
}
