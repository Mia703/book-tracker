export function formatSearch(searchInput: string) {
  return (
    searchInput
      // replace punctuation/currency/symbols with %XX
      .replace(/[\p{P}\p{S}]/gu, (char) => {
        const code = char.codePointAt(0);
        return `%${code?.toString(16).toUpperCase().padStart(2, "0")}`;
      })
      // replace spaces between characters with +
      .replace(/(?<=\S) +(?=\S)/g, "+")
      .toLowerCase()
  );
}
