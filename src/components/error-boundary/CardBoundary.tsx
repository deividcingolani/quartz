import React, { Component } from 'react';
import { Flex } from 'rebass';
import {
  Labeling,
  Value,
  Button,
  Card,
  CardProps,
} from '@logicalclocks/quartz';

import { Location } from 'history';
import withRouter from './withRouter';

interface CardBoundaryState {
  error?: Error;
}

interface CardBoundaryProps extends CardProps {
  location: Location;
}

class CardBoundary extends Component<CardBoundaryProps, CardBoundaryState> {
  constructor(props: CardBoundaryProps) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: Readonly<CardBoundaryProps>) {
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
    const { title } = this.props;

    if (error) {
      return (
        <Card {...this.props}>
          <Flex
            p="20px"
            height="100%"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
          >
            <Value>
              Something went wrong while loading {title || 'this card'}
            </Value>
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
        </Card>
      );
    }

    return children;
  }
}

export default withRouter(CardBoundary);
