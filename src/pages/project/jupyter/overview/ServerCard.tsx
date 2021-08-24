// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo, useState } from 'react';
import { Button, Card, usePopup } from '@logicalclocks/quartz';

// Hooks
import { useSelector } from 'react-redux';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
// Types
import { RootState } from '../../../../store';
// selectors
import {
  selectEnvironment,
  selectRunningServer,
} from '../../../../store/models/jupyter/jupyter.selectors';
// Utils
// eslint-disable-next-line import/no-named-as-default
import BlockedPopup from './popup/BlockedPopup';
// Layouts
import WithServer from './server/WithServer';
import WithoutServer from './server/WithoutServer';
import NoEnvironment from './server/NoEnvironment';

const CARD_TITLE = 'Jupyter server';

const ServerCard: FC = () => {
  const { data: runningServer } = useSelector(selectRunningServer);
  const isStopping = useSelector(
    (state: RootState) => state.loading.effects.jupyter.stop,
  );
  const isStarting = useSelector(
    (state: RootState) => state.loading.effects.jupyter.start,
  );

  const { data: env } = useSelector(selectEnvironment);

  const [popupBlocked, setPopupBlocked] = useState(false);
  const [isPopupOpen, handleToggle] = usePopup(false);

  const navigate = useNavigateRelative();

  const getHref = useGetHrefForRoute();

  const action = useMemo(
    () => (
      <Button
        p={0}
        intent="inline"
        disabled={isStarting || isStopping}
        href={getHref(`/jupyter/settings`, '/p/:id/*')}
        onClick={() => navigate(`/jupyter/settings`, '/p/:id/*')}
      >
        {`${runningServer ? 'view' : 'edit'} configuration`}
      </Button>
    ),
    [runningServer, isStarting, isStopping, getHref, navigate],
  );

  if (env?.isReady === false) {
    return (
      <Card title={CARD_TITLE} mb="20px">
        <NoEnvironment missingLibraries={env?.missingLibraries} />
      </Card>
    );
  }

  return (
    <>
      <Card title={CARD_TITLE} mb="20px" actions={action}>
        {runningServer ? (
          <WithServer
            isStopping={isStopping}
            popupBlocked={popupBlocked}
            handleToggle={handleToggle}
            runningServer={runningServer}
          />
        ) : (
          <WithoutServer
            isStarting={isStarting}
            isStopping={isStopping}
            setPopupBlocked={setPopupBlocked}
          />
        )}
      </Card>
      <BlockedPopup isPopupOpen={isPopupOpen} handleToggle={handleToggle} />
    </>
  );
};

export default ServerCard;
