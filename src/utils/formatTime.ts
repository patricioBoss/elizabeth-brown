import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date: string | Date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date: string | Date) {
  return format(new Date(date), 'dd MMM yyyy p');
}

export function fDateShort(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function fTimestamp(date: string | Date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date: string | Date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export const daysFromNow = (dateString: string): number => {
  const today = new Date();
  const date_to_reply = new Date(dateString);
  const timeinmilisec = date_to_reply.getTime() - today.getTime();
  return Math.abs(Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24)));
};
