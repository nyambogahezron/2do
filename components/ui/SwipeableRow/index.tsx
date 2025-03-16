import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	runOnJS,
	Easing,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { snapPoint } from 'react-native-redash';

export const HEIGHT = 64;
import Action from './Actions';

const { width } = Dimensions.get('window');
const customSnapPoints = [-width, -100, 0];
const styles = StyleSheet.create({
	background: {
		...StyleSheet.absoluteFillObject,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		overflow: 'hidden',
		height: HEIGHT,
		backgroundColor: 'transparent',
		paddingRight: 0,
	},
	container: {
		overflow: 'hidden',
		marginBottom: 5,
	},
	content: {
		flex: 1,
		width: '100%',
	},
});

interface ItemProps {
	onSwipe: () => void; // to called after a complete swipe
	children: React.ReactNode;
}

export default function SwipeableRow({ onSwipe, children }: ItemProps) {
	const translateX = useSharedValue(0);
	const offsetX = useSharedValue(0);
	const height = useSharedValue(HEIGHT);
	const deleteOpacity = useSharedValue(1);
	const isPaused = useSharedValue(false);
	const isRemoving = useSharedValue(false);

	const panGesture = Gesture.Pan()
		.onStart(() => {
			if (isRemoving.value) return;
			translateX.value = offsetX.value;
			isPaused.value = false;
		})
		.onUpdate((event) => {
			if (isRemoving.value) return;
			if (event.translationX < 0) {
				translateX.value = event.translationX + offsetX.value;
				isPaused.value = false;
			}
		})
		.onEnd((event) => {
			if (isRemoving.value) return;

			const velocity = event.velocityX;
			const distance = Math.abs(translateX.value);

			if (Math.abs(velocity) < 200 && distance > 20 && distance < 130) {
				isPaused.value = true;
				translateX.value = withTiming(-70);
				offsetX.value = -80;
			} else {
				const to = snapPoint(translateX.value, velocity, customSnapPoints);
				isPaused.value = false;

				translateX.value = withTiming(to, {}, () => {
					offsetX.value = translateX.value;
					if (to === -width) {
						// Start removal sequence directly here
						isRemoving.value = true;
						deleteOpacity.value = withTiming(0, { duration: 150 });

						// Animate height down to 0
						height.value = withTiming(
							0,
							{
								duration: 250,
								easing: Easing.out(Easing.ease),
							},
							() => {
								// Call onSwipe when done
								runOnJS(onSwipe)();
							}
						);
					}
				});
			}
		});

	// Simple function to cancel the swipe
	const cancelSwipe = () => {
		if (isRemoving.value) return;
		translateX.value = withTiming(0);
		offsetX.value = 0;
		isPaused.value = false;
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
		height: height.value,
		width: '100%',
	}));

	const backgroundStyle = useAnimatedStyle(() => ({
		opacity: deleteOpacity.value,
		justifyContent: 'flex-end',
	}));

	const containerStyle = useAnimatedStyle(() => ({
		height: height.value,
		overflow: 'hidden',
		width: width - 30,
		alignSelf: 'center',
		marginBottom: isRemoving.value ? 0 : 8,
	}));

	return (
		<Animated.View style={containerStyle}>
			<View style={[styles.background, backgroundStyle]}>
				<Action
					x={translateX}
					deleteOpacity={deleteOpacity}
					isPaused={isPaused}
					cancelSwipe={cancelSwipe}
				/>
			</View>
			<GestureDetector gesture={panGesture}>
				<Animated.View style={animatedStyle}>{children}</Animated.View>
			</GestureDetector>
		</Animated.View>
	);
}
