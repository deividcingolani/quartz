import { library } from '@fortawesome/fontawesome-svg-core';

// Font Awesome icons
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import Button from './components/button';
import UploadButton from './components/file-button';
import FileSystemExplorer from './components/file-system-explorer';
import FileLoader from './components/file-loader';

// Card
import Card from './components/card';
import CardSecondary from './components/card/card-secondary';

import Code from './components/code';
import Checkbox from './components/checkbox';
import Callout, { CalloutTypes } from './components/callout';
import CalloutWithButton from './components/calloutWithButton';
import CheckboxGroup from './components/checkbox/checkbox-group';
import SplitGraph, { graphColors } from './components/graphs/split-graph';
import Radio from './components/radio';
import RadioGroup from './components/radio/radio-group';
import Dropdown from './components/dropdown';
import FooterButton from './components/footer-button';
import Header from './components/header';
import AlternativeHeader from './components/alternative-header';
import Icon from './components/icon';
import { IconName, getIcon } from './components/icon/list';
import IconButton from './components/icon-button';
import MenuButton from './components/header/menu-button';
import Input from './components/input';
import InputInfo from './components/input-info';
import CodeInput from './components/code-input';
import Label from './components/label';
import List from './components/list/container';
import ListItem from './components/list/item';
import Pagination from './components/pagination';
import Tooltip from './components/tooltip';
import TooltipPositions from './components/tooltip/positions';
import Select from './components/select';
import EditableSelect from './components/editableSelect';
import ToggleButton from './components/toggle-button';
import NotificationsContainer from './components/notifications/index';
import NotificationsManager from './components/notifications/notifications-manager';
import DatePicker from './components/datepicker';
import Divider from './components/divider';
import Symbol from './components/symbol';
import { SymbolMode } from './components/symbol/types';
import Collapse from './components/collapse';

// Popups
import Drawer from './components/popup/drawer';
import DrawerSection from './components/popup/drawer/drawer-section';
import Popup from './components/popup';
import TinyPopup from './components/popup/tiny';
import usePopup from './utils/usePopup';

// Bars
import Bar from './components/bar';
import ProgressBar from './components/bar/progress';
import FreshnessBar from './components/bar/freshness';

// Badges
import User from './components/user';
import TextValueBadge from './components/badges/text-value-badge';
import Badge from './components/badges/badge';
import Dot from './components/badges/dot';
import ProjectBadge from './components/badges/project-badge';

// Navigation
import Navigation from './components/navigation/container';
import NavigationItem from './components/navigation/item';
import NavigationCategory from './components/navigation/category';
import NavigationProvider from './components/navigation/context/navigation.provider';
import NavigationContext from './components/navigation/context/navigation.context';
import Logo from './components/logo';

// Sticky Summary
import StickySummary from './components/sticky-summary';

// Row
import Row from './components/row/container';
import RowGroup from './components/row/group';
import RowItem from './components/row/item';
import RowButton from './components/row/button';

// Picker
import Picker from './components/picker/container';
import SingleRangeSlider from './components/picker/single-range-slider';
import MultiRangeSlider from './components/picker/multi-range-slider';

// Table
import Table from './components/table';
import ReadOnlyTable from './components/table/read-only';
import EditableTable from './components/table/editable';
import BlurInput from './components/table/editable/blur-input';

// Typography
import InputValidation from './components/typography/input-validation/input-validation';
import Value from './components/typography/value';
import Text from './components/typography/text';
import Title from './components/typography/title';
import Subtitle from './components/typography/subtitle';
import Labeling from './components/typography/labeling';
import Microlabeling from './components/typography/microlabeling';
import {
  HoverableText,
  HoverableLink,
} from './components/typography/hoverable';

// Icons
import FolderIcon from './components/icons/folder.icon';
// Theme
import ThemeProvider from './theme/ThemeProvider';
import theme from './theme/theme';

// Hooks
import useDropdown from './utils/useDropdown';
import useNavigation from './components/navigation/useNavigation';
import useOnClickOutside from './utils/useClickOutside';

// constants
import dateFormat from './utils/dateFormat';

library.add(fas, far);

export {
  Button,
  UploadButton,
  FileLoader,
  FileSystemExplorer,
  Card,
  CardSecondary,
  Code,
  InputValidation,
  Checkbox,
  Callout,
  CalloutTypes,
  CalloutWithButton,
  CheckboxGroup,
  Dropdown,
  FooterButton,
  Header,
  AlternativeHeader,
  Icon,
  IconName,
  getIcon,
  IconButton,
  MenuButton,
  Input,
  BlurInput,
  InputInfo,
  CodeInput,
  Label,
  Logo,
  List,
  ListItem,
  Pagination,
  Select,
  EditableSelect,
  ThemeProvider,
  ToggleButton,
  Tooltip,
  TooltipPositions,
  Radio,
  RadioGroup,
  DatePicker,
  Divider,
  // Popups
  usePopup,
  Popup,
  Drawer,
  TinyPopup,
  DrawerSection,
  // Bars
  Bar,
  ProgressBar,
  FreshnessBar,
  // Badges
  User,
  TextValueBadge,
  Badge,
  ProjectBadge,
  Dot,
  // Navigation
  Navigation,
  NavigationItem,
  NavigationCategory,
  NavigationProvider,
  NavigationContext,
  // Notifications
  NotificationsContainer,
  NotificationsManager,
  // Hooks
  useDropdown,
  useNavigation,
  // Row
  Row,
  RowGroup,
  RowItem,
  RowButton,
  // Picker
  Picker,
  SingleRangeSlider,
  MultiRangeSlider,
  //  Table
  Table,
  EditableTable,
  ReadOnlyTable,
  //  Typography
  Value,
  Text,
  HoverableText,
  HoverableLink,
  Title,
  Subtitle,
  Microlabeling,
  Labeling,
  StickySummary,
  SplitGraph,
  Collapse,
  //  Icons
  FolderIcon,
  useOnClickOutside,
  Symbol,
  SymbolMode,
  graphColors,
  theme,
  // Constants
  dateFormat,
};

export type ITheme = import('./theme/types').ITheme;
export type TooltipProps = import('./components/tooltip').TooltipProps;
export type TableColumn = import('./components/table/editable').TableColumn;
export type CardProps = import('./components/card').CardProps;
export type IThemeColors = import('./theme/types').IThemeColors;
export type FGRow = import('./components/table/type').FGRow;
export type FGItem = import('./components/table/type').FGItem;
export type TreeNode = import('./components/navigation/types').TreeNode;
