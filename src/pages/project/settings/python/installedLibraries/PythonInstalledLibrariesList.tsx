// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  ComponentType,
  FC,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
// Components
import { Box, Flex } from 'rebass';
import {
  Badge,
  Labeling,
  Row,
  RowButton,
  TinyPopup,
  usePopup,
  Value,
} from '@logicalclocks/quartz';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from '../ongoingOperations/operations.list.styles';
import PythonInstalledLibrariesListFilter, {
  PythonInstalledLibraryFilterValues,
} from './PythonInstalledLibrariesListFilter';
import {
  PythonCommandListDTO,
  PythonLibraryDTO,
} from '../../../../../types/python';
import { Dispatch } from '../../../../../store';
import NoData from '../../../../../components/no-data/NoData';

export interface PythonInstalledLibrariesListProps {
  data: PythonLibraryDTO[];
  version: string;
  loading: boolean;
  syncing: boolean;
}

const PythonInstalledLibrariesList: FC<PythonInstalledLibrariesListProps> = ({
  data,
  version,
  loading,
  syncing,
}) => {
  const [touchedLibrary, setTouchedLibrary] = useState<PythonLibraryDTO>();
  const [isRemoveLibraryPopupOpen, handleToggleRemoveLibrary] = usePopup(false);
  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<string>(
    PythonInstalledLibraryFilterValues.ANY,
  );
  const [isLibraryDelete, setLibraryDelete] = useState<boolean>(false);

  const shownData = useMemo(() => {
    let temp = !search.trim()
      ? data
      : data.filter((library) => {
          return library.library
            .toLowerCase()
            .includes(search.toLowerCase().trim());
        });
    temp =
      filter === PythonInstalledLibraryFilterValues.ANY
        ? temp
        : temp.filter((library) => {
            return library.packageSource.toLowerCase() === filter;
          });

    temp = temp.sort((first, second) => {
      if (first.library < second.library) {
        return -1;
      }
      if (first.library > second.library) {
        return 1;
      }
      return 0;
    });

    return temp;
  }, [search, data, filter]);

  const groupProps = useMemo(
    () =>
      shownData.map((library) => {
        const isInstalled =
          (library.commands as PythonCommandListDTO).count === 0;

        return [
          {
            variant: 'bold',
            children: library.library,
          },
          {
            children: `${
              library.packageSource === 'CONDA' ? `${library.channel} - ` : ''
            }${library.packageSource.toLowerCase()}`,
            gray: true,
          },
          {
            children: (
              <Badge
                value={library.version}
                variant="light"
                width="fit-content"
                alignItems="flex-end"
              />
            ),
          },
          {
            children: (
              <Flex
                sx={{
                  width: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                {isInstalled ? (
                  <RowButton
                    icon={<FontAwesomeIcon icon="trash-alt" />}
                    onClick={() => {
                      setTouchedLibrary(library);
                      return handleToggleRemoveLibrary();
                    }}
                    mainText="Uninstall"
                    disabled={
                      touchedLibrary !== undefined &&
                      touchedLibrary === library &&
                      isLibraryDelete
                    }
                  />
                ) : (
                  <RowButton
                    icon={<FontAwesomeIcon icon="angry" />}
                    mainText="Ongoing Operation"
                    onClick={() => undefined}
                    disabled={true}
                  />
                )}
              </Flex>
            ),
          },
        ];
      }),
    [isLibraryDelete, shownData, handleToggleRemoveLibrary, touchedLibrary],
  );

  const groupComponents = useMemo(() => {
    return shownData.map(() => [Value, Labeling, Value, Box]);
  }, [shownData]);

  const dispatch = useDispatch<Dispatch>();
  const { id: projectId } = useParams();

  const handleDelete = useCallback(async () => {
    if (touchedLibrary?.library) {
      handleToggleRemoveLibrary();
      setLibraryDelete(true);
      dispatch.pythonLibrary
        .uninstallLibrary({
          id: +projectId,
          version,
          name: touchedLibrary.library,
        })
        .then(() => {
          dispatch.pythonLibrary
            .getLibrariesWithOperations({
              id: +projectId,
              version,
            })
            .then(() => {
              setLibraryDelete(false);
            });
        });
    }
  }, [dispatch, projectId, handleToggleRemoveLibrary, touchedLibrary, version]);

  let content;

  if (syncing) {
    content = (
      <Box my="40px">
        <NoData mainText="Environment syncing..." />
      </Box>
    );
  } else if (loading && (!shownData || shownData.length === 0)) {
    content = (
      <Box my="40px">
        <NoData mainText="Loading..." />
      </Box>
    );
  } else {
    content =
      shownData.length === 0 ? (
        <Box my="40px">
          <NoData
            mainText={
              search !== ''
                ? 'No installed library match with that search'
                : 'No installed library'
            }
          />
        </Box>
      ) : (
        <Box sx={styles}>
          <Row
            middleColumn={5}
            groupProps={groupProps}
            groupComponents={groupComponents as ComponentType[][]}
          />
        </Box>
      );
  }

  return (
    <>
      <TinyPopup
        title={`Uninstall ${touchedLibrary?.library}`}
        secondaryText="Uninstalling libraries may affect Jupyter notebooks which still use it. Please be certain."
        isOpen={isRemoveLibraryPopupOpen}
        mainButton={['Uninstall the library', handleDelete]}
        secondaryButton={['Back', handleToggleRemoveLibrary]}
        onClose={handleToggleRemoveLibrary}
      />
      <Box my="20px">
        <PythonInstalledLibrariesListFilter
          setSearch={setSearch}
          search={search}
          filter={filter}
          setFilter={setFilter}
        />
      </Box>
      {content}
    </>
  );
};

export default memo(PythonInstalledLibrariesList);
