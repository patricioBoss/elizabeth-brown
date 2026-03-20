'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
// @mui
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface CollapseDrawerType {
  click: boolean;
  hover: boolean;
}

interface CollapseDrawerContextType extends CollapseDrawerType {
  isCollapse: boolean;
  collapseClick: boolean;
  collapseHover: boolean;
  onToggleCollapse: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}

const initialState: Omit<CollapseDrawerContextType, 'click' | 'hover'> = {
  isCollapse: false,
  collapseClick: false,
  collapseHover: false,
  onToggleCollapse: () => {},
  onHoverEnter: () => {},
  onHoverLeave: () => {},
};

const CollapseDrawerContext = createContext(initialState);

// ----------------------------------------------------------------------

interface CollapseDrawerProviderProps {
  children: ReactNode;
}

export function CollapseDrawerProvider({ children }: CollapseDrawerProviderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [collapse, setCollapse] = useState<CollapseDrawerType>({
    click: false,
    hover: false,
  });

  useEffect(() => {
    if (isMobile) {
      setCollapse({
        click: false,
        hover: false,
      });
    }
  }, [isMobile]);

  const handleToggleCollapse = () => {
    setCollapse({ ...collapse, click: !collapse.click });
  };

  const handleHoverEnter = () => {
    if (collapse.click) {
      setCollapse({ ...collapse, hover: true });
    }
  };

  const handleHoverLeave = () => {
    setCollapse({ ...collapse, hover: false });
  };

  return (
    <CollapseDrawerContext.Provider
      value={{
        isCollapse: collapse.click && !collapse.hover,
        collapseClick: collapse.click,
        collapseHover: collapse.hover,
        onToggleCollapse: handleToggleCollapse,
        onHoverEnter: handleHoverEnter,
        onHoverLeave: handleHoverLeave,
      }}
    >
      {children}
    </CollapseDrawerContext.Provider>
  );
}

export { CollapseDrawerContext };

export default CollapseDrawerContext;
