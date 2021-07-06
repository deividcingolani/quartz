// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from 'rebass';
// Hooks
import { useParams } from 'react-router-dom';
import { Labeling, Subtitle } from '@logicalclocks/quartz';
import useHistory from '../../../hooks/useHistory';
import useSearchData from '../../../components/search/useSearchData';
import useNavigateRelative from '../../../hooks/useNavigateRelative';
// Components
import ShortCutItem, { DTO } from './ShortcutItem';
import FixedShortcuts from './FixedShortcuts';
// Services
import ShortcutsService, {
  LSDataEntity,
  LSInnerKeys,
} from '../../../services/project/ShortcutsService';
// Utils
import filterByRecentHistory from './filterByRecentHistory';

const MAX_RESULTS_COUNT = 10;

export interface ShortcutsProps {
  userId: number;
}

const Shortcuts: FC<ShortcutsProps> = ({ userId }) => {
  const [recentlyOpened, setRecentlyOpened] = useState<LSDataEntity[]>([]);
  const [pinned, setPinned] = useState<LSDataEntity[]>([]);

  const { data } = useSearchData();
  const { history } = useHistory();

  const navigate = useNavigateRelative();

  const { id: projectId } = useParams();

  const allResults = useMemo(() => {
    return filterByRecentHistory(+projectId, data, history);
  }, [data, history, projectId]);

  const combineRecents = (
    newOpened: LSDataEntity[],
    oldOpened: LSDataEntity[],
  ) => {
    const newIds = newOpened.map((x) => x.id);
    const oldFiltered = oldOpened.filter(({ id }) => !newIds.includes(id));
    return [...newOpened, ...oldFiltered];
  };

  useEffect(() => {
    const initialPins = ShortcutsService.getPinned(userId, +projectId);
    setPinned(initialPins);
  }, [projectId, userId]);

  useEffect(() => {
    const recent = ShortcutsService.getRecent(userId, +projectId);
    const newRecent = combineRecents(allResults, recent);
    const limitedRecent = newRecent.slice(0, MAX_RESULTS_COUNT);
    setRecentlyOpened(newRecent);

    ShortcutsService.set(userId, +projectId, {
      key: LSInnerKeys.recent,
      items: limitedRecent,
    });
  }, [allResults, projectId, userId]);

  const handlePin = (item: LSDataEntity) => {
    const newPins = [item, ...pinned];
    setPinned(newPins);
    ShortcutsService.set(userId, +projectId, {
      key: LSInnerKeys.pinned,
      items: newPins,
    });
  };

  const handleUnPin = (item: LSDataEntity) => {
    const newPins = pinned.filter((prev) => prev.id !== item.id);
    setPinned(newPins);
    ShortcutsService.set(userId, +projectId, {
      key: LSInnerKeys.pinned,
      items: newPins,
    });
  };

  const handleNavigate = useCallback(
    (item: LSDataEntity) => {
      if (item.type === DTO.fg) {
        navigate(`/fg/${item.id}`, `p/:id/*`);
      } else if (item.type === DTO.td) {
        navigate(`/td/${item.id}`, `p/:id/*`);
      }
    },
    [navigate],
  );

  const pinnedIds = useMemo(() => pinned.map((x) => x.id), [pinned]);

  return (
    <Flex flexDirection="row" mx="20px" mt="40px">
      {/* LEFT SIDE */}
      <Flex flexDirection="column" width="50%" pr="30px">
        <Subtitle color="primary">Shortcuts</Subtitle>
        <Box mt="5px" mb="8px" bg="primary" height="1px" width="100%" />
        {pinned.map((item) => {
          return (
            <ShortCutItem
              item={item}
              key={item.id}
              pinnable={true}
              handlePin={handlePin}
              handleUnPin={handleUnPin}
              pinned={pinned.includes(item)}
              handleClick={handleNavigate}
            />
          );
        })}
        {pinned.length === 0 && (
          <Labeling mb="5px" gray>
            Nothing pinned
          </Labeling>
        )}
        <Box my="8px" bg="grayShade2" height="1px" width="100%" />
        <FixedShortcuts />
      </Flex>
      {/* RIGHT SIDE */}
      <Flex flexDirection="column" width="50%">
        <Subtitle color="primary">Recently opened</Subtitle>
        <Box mt="5px" mb="8px" bg="primary" height="1px" width="100%" />
        {recentlyOpened.map((item) => (
          <ShortCutItem
            pinnable
            item={item}
            key={item.id}
            handlePin={handlePin}
            handleUnPin={handleUnPin}
            handleClick={handleNavigate}
            pinned={pinnedIds.includes(item.id)}
          />
        ))}
        {recentlyOpened.length === 0 && (
          <Labeling gray>Nothing recently opened</Labeling>
        )}
      </Flex>
    </Flex>
  );
};

export default Shortcuts;
