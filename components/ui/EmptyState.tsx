import { View, Text } from 'react-native';
import React from 'react';
import { CircleCheckBig } from 'lucide-react-native';

export default function EmptyState() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: '50%',
			}}
		>
			<CircleCheckBig size={80} color={'#555'} />
			<Text style={{ color: '#444', margin: 10 }}>No data</Text>
		</View>
	);
}
