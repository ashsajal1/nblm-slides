export interface ParsedCSV {
    slides: { question: string; answer: string }[];
    name: string;
}

export function parseCSV(text: string, filename: string): ParsedCSV | null {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return null;

    const header = lines[0];
    if (
        !header.includes("问题") &&
        !header.includes("প্রশ্ন") &&
        !header.includes("Question")
    )
        return null;

    const slides: { question: string; answer: string }[] = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const match = line.match(/^"(.*?)","(.*)"$/s);
        if (!match) continue;

        const question = match[1].replace(/^\uFEFF/, "").trim();
        const answer = match[2].replace(/^\uFEFF/, "").trim();

        if (question && answer) {
            slides.push({ question, answer });
        }
    }

    if (slides.length === 0) return null;

    const name = filename
        .replace(/\.csv$/i, "")
        .replace(/_/g, " ")
        .trim();

    return { slides, name };
}
