function parseCheckinDate(checkIn) {
  const dateParts = String(checkIn.date || "").split(/[/-]/).map(Number);
  if (dateParts.length === 3 && dateParts.every(Number.isFinite)) {
    const [first, second, third] = dateParts;
    const year = third < 100 ? 2000 + third : third;
    const day = first > 12 ? first : second;
    const month = first > 12 ? second : first;
    const date = new Date(year, month - 1, day);
    const timeMatch = String(checkIn.time || "").match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
    if (timeMatch) {
      let hours = Number(timeMatch[1]);
      if (timeMatch[3]?.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (timeMatch[3]?.toLowerCase() === "am" && hours === 12) hours = 0;
      date.setHours(hours, Number(timeMatch[2]), 0, 0);
    }
    return date.getTime();
  }

  const idTimestamp = String(checkIn.id || "").match(/^LOCAL-(\d+)$/);
  return idTimestamp ? Number(idTimestamp[1]) : 0;
}

export function sortCheckIns(checkIns, direction = "ascending") {
  return checkIns
    .map((checkIn, index) => ({ checkIn, index }))
    .sort((left, right) => {
      const difference = parseCheckinDate(left.checkIn) - parseCheckinDate(right.checkIn);
      return (direction === "descending" ? -difference : difference) || left.index - right.index;
    })
    .map(({ checkIn }) => checkIn);
}
