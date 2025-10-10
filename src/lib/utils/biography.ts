/**
 * Biography formatting utilities
 * Sprint 10 - SEO & Navigation Unification
 * Auto-splits biography text into readable paragraphs
 */

/**
 * Formats a biography string into an array of paragraph strings
 *
 * Features:
 * - Detects existing paragraph breaks (\n\n)
 * - Auto-splits long text by sentence boundaries (3-4 sentences per paragraph)
 * - Context-aware grouping (keeps years, events, related sentences together)
 * - Max ~250-300 characters per paragraph for readability
 *
 * @param biography - The raw biography text (may contain \n\n breaks)
 * @param overrideParagraphs - Optional pre-formatted paragraphs array to use instead
 * @returns Array of paragraph strings
 */
export function formatBiography(
  biography: string,
  overrideParagraphs?: string[]
): string[] {
  // If override provided, use it directly
  if (overrideParagraphs && overrideParagraphs.length > 0) {
    return overrideParagraphs;
  }

  // If empty or very short, return as single paragraph
  if (!biography || biography.trim().length < 100) {
    return biography ? [biography.trim()] : [];
  }

  // Step 1: Check for existing paragraph breaks (\n\n)
  const existingParagraphs = biography.split(/\n\n+/);

  if (existingParagraphs.length > 1) {
    // Has existing breaks, but still split long paragraphs
    return existingParagraphs.flatMap((para) =>
      para.trim().length > 350 ? splitLongParagraph(para) : [para.trim()]
    ).filter(p => p.length > 0);
  }

  // Step 2: No existing breaks, auto-split by sentences
  return splitLongParagraph(biography);
}

/**
 * Splits a long text block into multiple paragraphs
 * Aims for 3-4 sentences or ~250-300 characters per paragraph
 * Context-aware: keeps related content together
 */
function splitLongParagraph(text: string): string[] {
  const trimmed = text.trim();

  // If short enough, return as is
  if (trimmed.length <= 350) {
    return [trimmed];
  }

  // Split into sentences using Spanish-aware regex
  // Handles periods, question marks, exclamation marks
  // Avoids splitting on abbreviations like "Sr.", "Dr.", "No."
  const sentenceEndings = /([.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/g;
  const sentences: string[] = [];

  let lastIndex = 0;
  let match;

  while ((match = sentenceEndings.exec(trimmed)) !== null) {
    const sentence = trimmed.substring(lastIndex, match.index + 1).trim();
    if (sentence.length > 0) {
      sentences.push(sentence);
    }
    lastIndex = match.index + 1;
  }

  // Add remaining text as last sentence
  const remaining = trimmed.substring(lastIndex).trim();
  if (remaining.length > 0) {
    sentences.push(remaining);
  }

  // If we couldn't split into sentences, return as single paragraph
  if (sentences.length === 0) {
    return [trimmed];
  }

  // Group sentences into paragraphs
  const paragraphs: string[] = [];
  let currentParagraph = "";
  let sentenceCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const nextSentence = sentences[i + 1];

    // Add sentence to current paragraph
    currentParagraph += (currentParagraph ? " " : "") + sentence;
    sentenceCount++;

    // Context-aware grouping: check if next sentence is related
    const isRelated = nextSentence && areRelatedSentences(sentence, nextSentence);

    // Decide whether to break paragraph
    const shouldBreak =
      // Target: 3-4 sentences per paragraph
      (sentenceCount >= 3 && currentParagraph.length >= 200 && !isRelated) ||
      // Hard limit: don't exceed ~350 characters unless related
      (currentParagraph.length >= 300 && !isRelated) ||
      // Always break if too long
      currentParagraph.length >= 400;

    if (shouldBreak || i === sentences.length - 1) {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = "";
      sentenceCount = 0;
    }
  }

  // Add any remaining text
  if (currentParagraph.trim().length > 0) {
    paragraphs.push(currentParagraph.trim());
  }

  return paragraphs.filter(p => p.length > 0);
}

/**
 * Checks if two sentences are contextually related
 * Used to keep related content together in the same paragraph
 */
function areRelatedSentences(sentence1: string, sentence2: string): boolean {
  // Check for year continuity (1980... 1981...)
  const yearPattern = /\b(19|20)\d{2}\b/g;
  const years1 = sentence1.match(yearPattern);
  const years2 = sentence2.match(yearPattern);

  if (years1 && years2) {
    // If both have consecutive years, they're likely related
    const year1 = parseInt(years1[years1.length - 1]);
    const year2 = parseInt(years2[0]);
    if (Math.abs(year1 - year2) <= 2) {
      return true;
    }
  }

  // Check for enumeration or continuation words
  const continuationWords = [
    "además", "también", "asimismo", "igualmente",
    "posteriormente", "luego", "después",
    "en", "durante", "desde",
    "allí", "donde",
  ];

  const sentence2Lower = sentence2.toLowerCase();
  const startsWithContinuation = continuationWords.some(word =>
    sentence2Lower.startsWith(word + " ") || sentence2Lower.startsWith(word + ",")
  );

  if (startsWithContinuation) {
    return true;
  }

  // Check for pronouns referring back (él, ella, esto, eso, etc.)
  const pronouns = ["él", "ella", "esto", "eso", "aquello", "este", "ese"];
  const hasReferentialPronoun = pronouns.some(pronoun =>
    sentence2Lower.split(/\s+/).slice(0, 3).includes(pronoun)
  );

  if (hasReferentialPronoun) {
    return true;
  }

  return false;
}
