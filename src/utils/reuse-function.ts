import { formatDistanceToNow } from "date-fns";

export const formatDateTime = (data: any) => {
  if (!data) return;
  const createdAtDate = data.toDate();
  const date = formatDistanceToNow(createdAtDate, {
    addSuffix: true,
  });

  return date;
};
