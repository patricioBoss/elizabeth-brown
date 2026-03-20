'use client';

import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { createContext, useEffect, useState, ReactNode } from 'react';
// utils
import getColorPresets, { colorPresets, defaultPreset, ColorPreset } from '../utils/getColorPresets';
// config
import { DEFAULT_SETTINGS, COOKIES_KEY, COOKIES_EXPIRES } from '../config-global';

// ----------------------------------------------------------------------

type ThemeMode = 'light' | 'dark';
type ThemeDirection = 'rtl' | 'ltr';
type ThemeLayout = 'vertical' | 'horizontal' | 'mini';
type ThemeColorPresets = 'default' | 'purple' | 'cyan' | 'blue' | 'orange' | 'red';

interface SettingsType {
  themeMode: ThemeMode;
  themeDirection: ThemeDirection;
  themeColorPresets: ThemeColorPresets;
  themeLayout: ThemeLayout;
  themeStretch: boolean;
}

interface SettingsContextType extends SettingsType {
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMode: () => void;
  onChangeDirection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleStretch: () => void;
  onChangeLayout: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetSetting: () => void;
  setColor: ColorPreset;
  colorOption: { name: string; value: string }[];
}

const initialState: SettingsContextType = {
  themeMode: 'light' as ThemeMode,
  themeDirection: 'ltr' as ThemeDirection,
  themeColorPresets: 'default' as ThemeColorPresets,
  themeLayout: 'vertical' as ThemeLayout,
  themeStretch: false,
  onChangeMode: () => {},
  onToggleMode: () => {},
  onChangeDirection: () => {},
  onChangeColor: () => {},
  onToggleStretch: () => {},
  onChangeLayout: () => {},
  onResetSetting: () => {},
  setColor: defaultPreset,
  colorOption: [],
};

const SettingsContext = createContext(initialState);

// ----------------------------------------------------------------------

interface SettingsProviderProps {
  children: ReactNode;
  defaultSettings?: Partial<SettingsType>;
}

export function SettingsProvider({ children, defaultSettings = {} }: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies({
    themeMode: 'light' as ThemeMode,
    themeDirection: 'ltr' as ThemeDirection,
    themeColorPresets: 'default' as ThemeColorPresets,
    themeLayout: 'vertical' as ThemeLayout,
    themeStretch: false,
    ...defaultSettings,
  });

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: event.target.value as ThemeMode,
    });
  };

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  const onChangeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeDirection: event.target.value as ThemeDirection,
    });
  };

  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeColorPresets: event.target.value as ThemeColorPresets,
    });
  };

  const onChangeLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeLayout: event.target.value as ThemeLayout,
    });
  };

  const onToggleStretch = () => {
    setSettings({
      ...settings,
      themeStretch: !settings.themeStretch,
    });
  };

  const onResetSetting = () => {
    setSettings({
      themeMode: initialState.themeMode,
      themeLayout: initialState.themeLayout,
      themeStretch: initialState.themeStretch,
      themeDirection: initialState.themeDirection,
      themeColorPresets: initialState.themeColorPresets,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        // Mode
        onChangeMode,
        onToggleMode,
        // Direction
        onChangeDirection,
        // Color
        onChangeColor,
        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),
        // Stretch
        onToggleStretch,
        // Navbar Horizontal
        onChangeLayout,
        // Reset Setting
        onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsContext };

// ----------------------------------------------------------------------

function useSettingCookies(defaultSettings: SettingsType) {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  const onChangeSetting = () => {
    Cookies.set(COOKIES_KEY.themeMode, settings.themeMode, { expires: COOKIES_EXPIRES });
    Cookies.set(COOKIES_KEY.themeDirection, settings.themeDirection, { expires: COOKIES_EXPIRES });
    Cookies.set(COOKIES_KEY.themeColorPresets, settings.themeColorPresets, {
      expires: COOKIES_EXPIRES,
    });
    Cookies.set(COOKIES_KEY.themeLayout, settings.themeLayout, {
      expires: COOKIES_EXPIRES,
    });
    Cookies.set(COOKIES_KEY.themeStretch, JSON.stringify(settings.themeStretch), {
      expires: COOKIES_EXPIRES,
    });
  };

  useEffect(() => {
    onChangeSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return [settings, setSettings] as const;
}

export default SettingsContext;
