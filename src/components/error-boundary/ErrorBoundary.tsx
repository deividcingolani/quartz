import { Flex } from 'rebass';
import React, { Component } from 'react';
import { Labeling, Value, Button } from '@logicalclocks/quartz';

import { Location } from 'history';
import withRouter from './withRouter';
import titles from '../../sources/titles';

interface ErrorBoundaryState {
  error?: Error;
}

interface ErrorBoundaryProps {
  location: Location;
}

const pagesMap = [
  [
    (path: string) => path.includes('storage-connectors/new'),
    titles.storageConnectors,
  ],
  [
    (path: string) => path.includes('storage-connectors/edit'),
    titles.editStorageConnector,
  ],
  [
    (path: string) => path.includes('storage-connectors'),
    titles.storageConnectors,
  ],
  [(path: string) => path.includes('fg/new'), titles.createFeatureGroup],
  [(path: string) => path.includes('fg/edit'), titles.editFg],
  [(path: string) => path.includes('td/new'), titles.createTrainingDataset],
  [(path: string) => path.includes('td/edit'), titles.editTd],
];

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>) {
    const { location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ error: undefined });
    }
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { error } = this.state;

    const { location } = this.props;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const pageNameFn = pagesMap.find(([fn]) => fn(location.pathname));

    const pageName = pageNameFn ? pageNameFn[1] : 'this';

    if (error) {
      return (
        <Flex
          p="20px"
          height="100%"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
        >
          <Value>Something went wrong while loading {pageName} page</Value>
          <Value>-</Value>
          <Flex>
            <Labeling>Reload the page or</Labeling>
            <Button
              pl="3px"
              mt="-8px"
              intent="inline"
              width="fit-content"
              onClick={() =>
                window.open(
                  'https://docs.google.com/forms/d/e/1FAIpQLSfXLE7nxd1tstmMzzFy3D4RPcYT76q6o3eHQ6YPu6255pj3sw/viewform',
                  '_blank',
                )
              }
            >
              contact support
            </Button>
          </Flex>
        </Flex>
      );
    }

    return children;
  }
}

export default withRouter(ErrorBoundary);
