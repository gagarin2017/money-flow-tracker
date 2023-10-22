const MAX_TEXT_LENGTH = 15;

// Shorten the given text to the specified number of chars
// returns result string (short string) and a boolean saying if string was shortened. That bulean will be used to determing if tooltip should be shown for example
export const shortenGivenTextWithEllipsis = (
  text: string,
  maxStringLength?: number
) => {
  const max_length = maxStringLength ? maxStringLength : MAX_TEXT_LENGTH;

  let resultText = "";
  let textIsTooLong = false;

  if (text) {
    textIsTooLong = text.length > max_length;
    resultText = textIsTooLong
      ? text.substring(0, max_length - 3) + "..."
      : text;
  }

  return { resultText, textIsTooLong };
};
