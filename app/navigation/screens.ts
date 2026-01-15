import Notes from '../notes';
import ShoppingList from '../shoppingList'
import Theme from '../theme';
import TodosScreen from '../todo';
import SettingsScreen from '../settings';
import EditTodoScreen from '../todo/edit';

const SCREENS = {
	Notes,
	ShoppingList,
	Theme,
	TodosScreen,
	SettingsScreen,
	EditTodoScreen,
}

export default SCREENS;

export type RootStackParamList = {
	Home: undefined;
	Settings: undefined;
	Notes: undefined;
	ShoppingList: undefined;
};
