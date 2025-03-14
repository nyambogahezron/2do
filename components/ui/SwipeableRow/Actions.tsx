import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useDerivedValue,
	interpolate,
	Extrapolation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export const HEIGHT = 64;

const styles = StyleSheet.create({
	remove: {
		color: 'white',
		fontFamily: 'UberMoveMedium',
		fontSize: 14,
	},
	xContainer: {
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionContainer: {
		position: 'absolute',
		right: 8,
	}
});

interface ActionProps {
	x: Animated.SharedValue<number>;
	deleteOpacity: Animated.SharedValue<number>;
	isPaused: Animated.SharedValue<boolean>;
	cancelSwipe: () => void;
}

export default function Action({ x, deleteOpacity, isPaused, cancelSwipe }: ActionProps){
	const size = useDerivedValue(() => {
		if (isPaused.value) {
			return 56;
		}
		return Math.max(80, Math.abs(x.value) < HEIGHT ? Math.abs(x.value) : Math.abs(x.value) + (Math.abs(x.value) - HEIGHT));
	});

	const translateX = useDerivedValue(() => {
		return Math.abs(x.value) < HEIGHT ? 0 : (Math.abs(x.value) - HEIGHT) / 2;
	});

	const borderRadius = useDerivedValue(() => {
		if (isPaused.value) {
			return 28;
		}
		return Math.min(size.value / 2, 32);
	});

	const scale = useDerivedValue(() => {
		return interpolate(size.value, [0, HEIGHT], [0.5, 1], Extrapolation.CLAMP);
	});

	// Updated trash icon visibility logic - fade out when text starts to appear
	const trashIconOpacity = useDerivedValue(() => {
		if (isPaused.value) return 0;
		
		return interpolate(
			Math.abs(x.value),
			[10, 50, 100],
			[0, 1, 0],
			Extrapolation.CLAMP
		);
	});

	// X icon logic - ensure it's fully visible when paused
	const xIconOpacity = useDerivedValue(() => {
		return isPaused.value ? 1 : 0;
	});

	// Ensure text has enough room to be fully visible
	const textOpacity = useDerivedValue(() => {
		if (isPaused.value) return 0;
		
		return interpolate(
			Math.abs(x.value),
			[80, 120, 170],
			[0, 0.5, 1],
			Extrapolation.CLAMP
		);
	});

	const initialVisibility = useDerivedValue(() => {
		return Math.abs(x.value) <= 5 ? 0 : 1;
	});

	const animatedStyle = useAnimatedStyle(() => ({
		backgroundColor: '#D93F12',
		borderRadius: borderRadius.value,
		justifyContent: 'center',
		alignItems: 'center',
		height: isPaused.value ? 56 : HEIGHT,
		width: size.value,
		opacity: initialVisibility.value,
		position: 'absolute',
		right: 0,
	}));

	const trashIconStyle = useAnimatedStyle(() => ({
		height: '100%',
		width: '100%',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		opacity: trashIconOpacity.value,
	}));

	const xIconStyle = useAnimatedStyle(() => ({
		height: '100%',
		width: '100%',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 999,
		opacity: xIconOpacity.value,
	}));

	const textStyle = useAnimatedStyle(() => ({
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
		opacity: textOpacity.value * deleteOpacity.value,
		paddingHorizontal: 10,
	}));

	return (
		<Animated.View style={[animatedStyle, styles.actionContainer]}>
			<Animated.View style={trashIconStyle}>
				<Ionicons name="trash-bin" color={'#fff'} size={30} />
			</Animated.View>
			
			<Animated.View style={xIconStyle}>
				<TouchableOpacity 
					style={styles.xContainer} 
					onPress={cancelSwipe}
					activeOpacity={0.7}
				>
					<Ionicons name="close" color={'#fff'} size={28} />
				</TouchableOpacity>
			</Animated.View>
			
			<Animated.View style={textStyle}>
				<Text style={styles.remove}>Remove</Text>
			</Animated.View>
		</Animated.View>
	);
};


