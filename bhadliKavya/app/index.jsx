import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Welcome() {
    return (
        <View className="flex-1 justify-center items-center bg-blue-50 px-4">
            <Text className="text-3xl font-bold text-blue-800 mb-8">Welcome to MDBILEAPP</Text>

            <View className="w-full max-w-xs space-y-4">
                <Link href="/signup" asChild>
                    <TouchableOpacity className="bg-blue-600 py-3 rounded-lg">
                        <Text className="text-white text-center text-lg font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/login" asChild>
                    <TouchableOpacity className="bg-white border border-blue-600 py-3 rounded-lg">
                        <Text className="text-blue-600 text-center text-lg font-semibold">Login</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}