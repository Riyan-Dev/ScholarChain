export const commaSplitString = (input_string: any) => {
  if (!input_string) {
    return [];
  }

  const parts = input_string.split(",");
  const result = [];

  for (const part of parts) {
    const stripped_part = part.trim();
    if (stripped_part) {
      result.push(stripped_part);
    }
  }
  return result;
}
