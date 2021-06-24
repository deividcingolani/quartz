const setStatus = (status: string, items: any[] = []) => {
  const runningCount = items.filter((item) => item.state === 'RUNNING').length;
  if (runningCount) {
    return {
      width: 'fit-content',
      value: `${runningCount} ${
        runningCount > 1 ? 'executions' : 'execution'
      } in progress`,
      variant: 'light',
    };
  }
  switch (status) {
    case 'SUCCEEDED': {
      return {
        width: 'fit-content',
        value: 'success',
        variant: 'success',
      };
    }
    case 'FAILED': {
      return {
        width: 'fit-content',
        value: 'fail',
        variant: 'fail',
      };
    }
    case 'IN_PROGRESS': {
      return {
        width: 'fit-content',
        value: 'in progress',
        variant: 'light',
      };
    }
    case 'KILLED': {
      return {
        width: 'fit-content',
        value: 'killed',
        variant: 'label',
      };
    }
    case 'UNDEFINED': {
      return {
        width: 'fit-content',
        value: 'undefined',
        variant: 'label',
      };
    }
    default: {
      return {
        width: 'fit-content',
        value: 'undefined',
        variant: 'label',
      };
    }
  }
};

export default setStatus;
