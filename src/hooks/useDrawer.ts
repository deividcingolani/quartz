import { useCallback, useContext, useEffect, useState } from 'react';
import { usePopup } from '@logicalclocks/quartz';
import { ContentContext } from '../layouts/app/AppLayout';

const useDrawer = () => {
  const [isOpen, handleToggle] = usePopup(false);

  const [selectedId, setSelected] = useState<number | null>(null);

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
    (id: number) => () => {
      setSelected(id);
      if (!selectedId) {
        handleToggle();
      }

      handleDisableScroll();
    },
    [handleToggle, selectedId, handleDisableScroll],
  );

  const handleClose = useCallback(() => {
    setSelected(null);
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
    handleClose,
    handleSelectItem,
  };
};

export default useDrawer;
