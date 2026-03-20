// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

type Query = 'up' | 'down' | 'between' | 'only';
type Key = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export default function useResponsive(query: Query, key?: Key, start?: Key, end?: Key): boolean {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(key || 'xs'));

  const mediaDown = useMediaQuery(theme.breakpoints.down(key || 'xs'));

  const mediaBetween = useMediaQuery(theme.breakpoints.between(start || 'xs', end || 'xs'));

  const mediaOnly = useMediaQuery(theme.breakpoints.only(key || 'xs'));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between') {
    return mediaBetween;
  }

  if (query === 'only') {
    return mediaOnly;
  }

  return false;
}
