import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
	SharedValue,
	useAnimatedStyle,
	interpolate,
} from 'react-native-reanimated';

const width = Dimensions.get('window').width;

type SwipeableRowProps = {
	onDelete: () => any;
	children: React.ReactNode;
};

function RightAction({
	drag,
	onDelete,
}: {
	drag: SharedValue<number>;
	onDelete: () => void;
}) {
	const styleAnimation = useAnimatedStyle(() => {
		const translateX = interpolate(drag.value, [0, -50], [50, 0]);
		return {
			transform: [{ translateX }],
		};
	});
	function close() {
		drag.value = 0;
	}

	return (
		<Reanimated.View style={[styles.actionContainer, styleAnimation]}>
			<TouchableOpacity
				onPress={() => {
					close();
					onDelete();
				}}
				style={styles.actionButton}
			>
				<MaterialIcons name='delete' size={22} color='#fff' />
			</TouchableOpacity>
		</Reanimated.View>
	);
}

export default function SwipeableRow({
	onDelete,
	children,
}: React.PropsWithChildren<SwipeableRowProps>) {
	return (
		<ReanimatedSwipeable
			containerStyle={styles.swipeable}
			friction={2}
			enableTrackpadTwoFingerGesture
			rightThreshold={40}
			renderRightActions={(progress, dragX) => (
				<RightAction drag={dragX} onDelete={onDelete} />
			)}
		>
			{children}
		</ReanimatedSwipeable>
	);
}

const styles = StyleSheet.create({
	rightAction: { width: 44, height: '100%', backgroundColor: 'purple' },
	swipeable: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 'auto',
	},
	actionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		backgroundColor: 'red',
		borderRadius: 25,
	},
});
