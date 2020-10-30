import { useCallback, useEffect, useState } from 'react';

import anchorsContainer from './AnchorsContainer';

export type UseAnchor = {
  active: string | null;
  setActive: (anchorName: string | null) => void;
};

const useAnchor = (groupName: string): UseAnchor => {
  const [active, setActive] = useState<string | null>(
    anchorsContainer.active(groupName),
  );

  const handleChange = useCallback(
    (anchorName) => {
      if (active !== anchorName) {
        anchorsContainer.setActive(groupName, anchorName);
      }
    },
    [groupName, active],
  );

  useEffect(() => {
    if (!anchorsContainer.isGroupExists(groupName)) {
      anchorsContainer.addGroup(groupName);
    }

    anchorsContainer.subscribe(groupName, setActive);

    return (): void => {
      anchorsContainer.unsubscribe(groupName, setActive);
    };
  }, [groupName, setActive]);

  return { active, setActive: handleChange };
};

export default useAnchor;
