// Format date
export const formatDate = (date: { seconds: number }) => {
  const formattedDate = date?.seconds
    ? new Date(date.seconds * 1000).toLocaleDateString("vi-VI")
    : "Unknown";
  return formattedDate;
};
