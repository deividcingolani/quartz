// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  ChangeEvent,
  ComponentType,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Components
import { Box, Flex } from 'rebass';
import {
  Badge,
  Input,
  Labeling,
  Row,
  RowButton,
  Select,
  Value,
} from '@logicalclocks/quartz';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Dispatch } from '../../../../../store';
import {
  PythonLibraryDTO,
  PythonLibrarySearchDTO,
  PythonLibrarySearchInstallationStatus,
  PythonLibrarySearchListDTO,
} from '../../../../../types/python';
import styles from '../installedLibraries/installedLibraries.list.styles';
import Loader from '../../../../../components/loader/Loader';

interface NewLibrarySearchProps {
  installedLibraries: PythonLibraryDTO[];
  manager: string;
  packageSource: string;
  channel?: string;
  isInstallingFc: (lib: PythonLibrarySearchDTO) => boolean;
  isInstallingFailedFc: (lib: PythonLibrarySearchDTO) => boolean;
  isDeletingFc: (lib: PythonLibrarySearchDTO) => boolean;
  postInstallationCheck: (arg: number) => void;
  // setInstallCount: (arg: number) => void;
  setIsRequesting: (arg: boolean) => void;
  installCount: number;
}
interface SearchResultWithVersion {
  searchResult: PythonLibrarySearchDTO;
  version: string;
  installSubmit: boolean;
  deleteSubmit: boolean;
}

const NewLibrarySearch: FC<NewLibrarySearchProps> = ({
  installedLibraries,
  manager,
  packageSource,
  channel,
  isInstallingFc,
  isInstallingFailedFc,
  isDeletingFc,
  postInstallationCheck,
  installCount,
  setIsRequesting,
}) => {
  const dispatch = useDispatch<Dispatch>();
  const { id: projectId, version } = useParams();
  const [searchResults, setSearchResults] = useState<SearchResultWithVersion[]>(
    [],
  );
  const searchResultsRef = useRef(searchResults);
  const [search, setSearch] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const setSingleSearchResult = useCallback(
    (originalSR: SearchResultWithVersion, newSR: SearchResultWithVersion) => {
      const index: number = searchResults.findIndex((el) => el === originalSR);
      const updatedSearchResults = [...searchResults];
      updatedSearchResults[index] = newSR;
      setSearchResults(updatedSearchResults);
    },
    [searchResults],
  );

  const updateSearch = useCallback(
    (res: PythonLibrarySearchListDTO) => {
      const newRes = res.items.map((item) => {
        const existing: SearchResultWithVersion | undefined =
          searchResultsRef.current.find((sr) => sr.searchResult === item); // keep the selected version
        return {
          searchResult: item,
          version: existing ? existing.version : item.versions[0].version,
          installSubmit: isInstallingFc(item),
          deleteSubmit: isDeletingFc(item),
        };
      });

      setSearchResults(newRes);
    },
    [searchResultsRef, isDeletingFc, isInstallingFc, setSearchResults],
  );

  const handleSearch = useCallback(
    (searchQuery) => {
      return dispatch.pythonLibrary.searchLibraries({
        id: +projectId,
        version,
        searchQuery,
        manager,
        channel,
      });
    },
    [dispatch.pythonLibrary, projectId, version, manager, channel],
  );

  useEffect(() => {
    if (search === '') {
      setSearchResults([]);
    }

    const timeoutId = setTimeout(() => {
      if (search !== '') {
        setIsSearching(true);
        handleSearch(search)
          .then(updateSearch)
          .then(() => setIsSearching(false))
          .catch((err) => {
            setIsSearching(false);
            throw err;
          });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, handleSearch, updateSearch]);

  const handleLibraryDelete = useCallback(
    (searchResultWithVersion: SearchResultWithVersion) => {
      setSingleSearchResult(searchResultWithVersion, {
        ...searchResultWithVersion,
        deleteSubmit: true,
      });

      setIsRequesting(true);
      dispatch.pythonLibrary
        .uninstallLibrary({
          id: +projectId,
          version,
          name: searchResultWithVersion.searchResult.library,
        })
        .then(() => {
          dispatch.pythonLibrary.getLibrariesWithOperations({
            id: +projectId,
            version,
          });
          setIsRequesting(false);
        })
        .catch((err: any) => {
          setIsRequesting(false);
          throw err;
        });
    },
    [
      dispatch.pythonLibrary,
      projectId,
      version,
      setSingleSearchResult,
      setIsRequesting,
    ],
  );

  const handleLibraryInstall = useCallback(
    (searchResultWithVersion: SearchResultWithVersion) => {
      setSingleSearchResult(searchResultWithVersion, {
        ...searchResultWithVersion,
        installSubmit: true,
      });

      dispatch.pythonLibrary
        .installLibrary({
          id: +projectId,
          version,
          name: searchResultWithVersion.searchResult.library,
          data: {
            version: searchResultWithVersion.version,
            library: searchResultWithVersion.searchResult.library,
            packageSource,
            channelUrl: channel,
          },
        })
        .then(() => {
          postInstallationCheck(installCount + 1);
          dispatch.pythonLibrary.getLibrariesWithOperations({
            id: +projectId,
            version,
          });
        });
    },
    [
      installCount,
      postInstallationCheck,
      channel,
      setSingleSearchResult,
      projectId,
      version,
      dispatch.pythonLibrary,
      packageSource,
    ],
  );

  const getBadge = (
    isInstallingBool: boolean,
    isInstallFailed: boolean,
    isDeletingBool: boolean,
  ) => {
    if (isInstallingBool) {
      return ['installing', 'light'];
    }
    if (isDeletingBool) {
      return ['uninstalling', 'warning'];
    }
    if (isInstallFailed) {
      return ['failed', 'fail'];
    }
    return ['installed', 'success'];
  };

  const groupProps = useMemo(
    () =>
      searchResults.map((searchResultWithVersion: SearchResultWithVersion) => {
        const isInstallingBool = isInstallingFc(
          searchResultWithVersion.searchResult,
        );
        const isInstallFailedBool = isInstallingFailedFc(
          searchResultWithVersion.searchResult,
        );
        const isDeletingBool = isDeletingFc(
          searchResultWithVersion.searchResult,
        );
        // delete failed?

        const badgeInfo = getBadge(
          isInstallingBool,
          isInstallFailedBool,
          isDeletingBool,
        );
        return [
          {
            variant: 'bold',
            children: searchResultWithVersion.searchResult.library,
          },
          {
            children:
              searchResultWithVersion.searchResult.status ===
              PythonLibrarySearchInstallationStatus.INSTALLED ? (
                <Badge
                  value={badgeInfo[0]}
                  variant={
                    badgeInfo[1] as 'light' | 'fail' | 'success' | 'warning'
                  }
                  width="fit-content"
                  alignItems="flex-end"
                />
              ) : (
                <></>
              ),
          },
          {
            children:
              searchResultWithVersion.searchResult.status !==
              PythonLibrarySearchInstallationStatus.INSTALLED ? (
                <Select
                  maxWidth="180px"
                  width="max-content"
                  ml="15px"
                  placeholder=""
                  value={[searchResultWithVersion.version]}
                  options={searchResultWithVersion.searchResult.versions.map(
                    (obj) => obj.version,
                  )}
                  disabled={searchResultWithVersion.installSubmit}
                  onChange={(value: string[]) => {
                    const newVersion = value[0];
                    setSingleSearchResult(searchResultWithVersion, {
                      ...searchResultWithVersion,
                      version: newVersion,
                    });
                  }}
                />
              ) : (
                <Select // disabled when INSTALLED, so when ongoing, new, failed... maybe pending?
                  maxWidth="180px"
                  width="max-content"
                  ml="15px"
                  placeholder=""
                  value={(() => {
                    const installedLib = installedLibraries.find(
                      (el: PythonLibraryDTO) =>
                        el.library ===
                        searchResultWithVersion.searchResult.library,
                    );
                    return [installedLib ? installedLib.version : '?'];
                  })()}
                  disabled={true}
                  onChange={() => undefined}
                  options={[]}
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
                {searchResultWithVersion.searchResult.status ===
                PythonLibrarySearchInstallationStatus.INSTALLED ? (
                  <RowButton
                    icon={<FontAwesomeIcon icon="trash" />}
                    onClick={() => handleLibraryDelete(searchResultWithVersion)}
                    mainText="Uninstall Library"
                    disabled={
                      isInstallingBool ||
                      searchResultWithVersion.installSubmit ||
                      isDeletingBool ||
                      searchResultWithVersion.deleteSubmit ||
                      isInstallFailedBool
                    }
                  />
                ) : (
                  <RowButton
                    icon={<FontAwesomeIcon icon="plus" />}
                    onClick={() =>
                      handleLibraryInstall(searchResultWithVersion)
                    }
                    mainText="Install Library"
                    disabled={
                      isInstallingBool ||
                      searchResultWithVersion.installSubmit ||
                      isDeletingBool ||
                      searchResultWithVersion.deleteSubmit
                    }
                  />
                )}
              </Flex>
            ),
          },
        ];
      }),
    [
      isInstallingFc,
      isDeletingFc,
      isInstallingFailedFc,
      setSingleSearchResult,
      searchResults,
      handleLibraryInstall,
      handleLibraryDelete,
      installedLibraries,
    ],
  );

  const groupComponents = useMemo(() => {
    return searchResults.map(() => [Value, Labeling, Value, Box]);
  }, [searchResults]);

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" mb="20px">
        <Labeling bold mb="8px">
          Find a library by name
        </Labeling>
        <Input
          value={search}
          icon="search"
          placeholder="library name"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
          }}
          width="100%"
        />
      </Flex>

      {isSearching && <Loader />}
      {!isSearching && (
        <Flex
          sx={{ ...styles, overflowY: 'scroll', height: 'calc(100vh - 400px)' }}
        >
          <Row
            middleColumn={5}
            groupProps={groupProps}
            groupComponents={groupComponents as ComponentType[][]}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default memo(NewLibrarySearch);
