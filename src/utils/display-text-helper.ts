const MAX_TEXT_LENGTH = 15;

// Shorten the given text to the specified number of chars
export const shortenGivenTextWithEllipsis = (
  text: string,
  maxStringLength?: number
) => {
  const max_length = maxStringLength ? maxStringLength : MAX_TEXT_LENGTH;

  let textIsTooLong = text.length > max_length;
  const shortenedText = textIsTooLong
    ? text.substring(0, max_length - 3) + "..."
    : text;

  return { shortenedText, textIsTooLong };
};
