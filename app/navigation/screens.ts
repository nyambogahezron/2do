import Notes from '../notes';
import ShoppingList from '../shoppingList';
import Profile from '../profile';
import Donate from '../donate';
import Theme from '../theme';
import Widget from '../widget';
import TodosScreen from '../todo';
import SettingsScreen from '../settings';
import EditTodoScreen from '../todo/edit';

const SCREENS = {
	Notes,
	ShoppingList,
	Profile,
	Donate,
	Theme,
	Widget,
	TodosScreen,
	SettingsScreen,
	EditTodoScreen,
};

export default SCREENS;

export type RootStackParamList = {
	Home: undefined;
	Settings: undefined;
	Notes: undefined;
	ShoppingList: undefined;
};
