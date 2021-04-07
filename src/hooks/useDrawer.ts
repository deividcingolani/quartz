import { usePopup } from '@logicalclocks/quartz';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ContentContext } from '../layouts/app/AppLayout';

const useDrawer = <T = number>(initialState = false) => {
  const [isOpen, handleToggle] = usePopup(initialState);

  const [selectedId, setSelected] = useState<T | null>(null);
  const [selectedName, setSelectedName] = useState('');

  const { current: content } = useContext(ContentContext);

  const handleDisableScroll = useCallback(() => {
    if (content) {
      content.style.height = '100%';
      content.style.overflow = 'hidden';
    }
  }, [content]);

  const handleEnableScroll = useCallback(() => {
    if (content) {
      content.style.height = 'auto';
      content.style.overflow = 'auto';
    }
  }, [content]);

  const handleSelectItem = useCallback(
    (id: T) => () => {
      setSelected(id);
      if (!selectedId) {
        handleToggle();
      }

      handleDisableScroll();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleToggle, selectedId, handleDisableScroll],
  );

  const handleSelectItemByName = (name: string) => {
    setSelectedName(name);
    if (!selectedName) {
      handleToggle();
    }

    handleDisableScroll();
  };

  const handleClose = useCallback(() => {
    setSelected(null);
    setSelectedName('');
    handleToggle();

    handleEnableScroll();
  }, [handleToggle, handleEnableScroll]);

  useEffect(() => {
    return () => {
      handleEnableScroll();
    };
  }, [handleEnableScroll]);

  return {
    isOpen,
    selectedId,
    selectedName,
    handleClose,
    handleSelectItem,
    handleSelectItemByName,
  };
};

export default useDrawer;
