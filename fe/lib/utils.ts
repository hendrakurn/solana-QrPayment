type ClassValue = string | number | null | false | undefined | ClassValue[];

/**
 * Lightweight class merger — concatenates truthy values, dedupes, and trims.
 * Avoids pulling in clsx/tailwind-merge while keeping ergonomic class composition.
 */
export function cn(...args: ClassValue[]): string {
  const out: string[] = [];
  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };
  args.forEach(walk);
  return out.join(" ").replace(/\s+/g, " ").trim();
}
