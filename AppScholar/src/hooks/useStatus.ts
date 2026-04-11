import { useState } from 'react';
import { UI_SETTINGS } from '../config/config';

export const useStatus = () => {
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showStatus = (msg: string, type: 'success' | 'error' | 'warning' = 'error') => {
    setStatus({ msg, type });

    setTimeout(() => setStatus(null), UI_SETTINGS.STATUS_DURATION);
  };

  const hideStatus = () => setStatus(null);

  return { status, showStatus, hideStatus };
};