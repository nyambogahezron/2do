import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, IconButton } from 'react-native-paper';
import TodoForm from './TodoForm';
import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type props = {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddTodoModel({ visible, setVisible }: props) {
	const hideModal = () => setVisible(false);
	const { themeClrs } = useTheme();

	return (
		<Modal
			style={styles.modal}
			visible={visible}
			onDismiss={hideModal}
			contentContainerStyle={[
				styles.containerStyle,
				{ backgroundColor: themeClrs.colors.card },
			]}
		>
			{/* close icon  */}
			<View style={styles.closeView}>
				<IconButton
					style={styles.closeButton}
					icon='close'
					onPress={hideModal}
				/>
			</View>
			<TodoForm onCancel={hideModal} />
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		width: '100%',
		padding: 20,
	},
	containerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 15,
		top: -20,
		width: '100%',
		borderRadius: 10,
	},
	closeView: {
		display: 'flex',
		alignItems: 'flex-end',
		width: '100%',
	},
	closeButton: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		borderRadius: 25,
	},
});
