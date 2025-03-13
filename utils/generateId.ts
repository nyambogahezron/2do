import { randomUUID } from 'expo-crypto';

export default function useGenerateId() {
	return randomUUID();
}
