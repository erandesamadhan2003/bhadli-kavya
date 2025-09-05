import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
    const handleLogout = () => {
        // Here you would typically handle logout logic
        router.push('/');
    };

    return (
        <SafeAreaView className="flex-1 justify-center bg-white">
            <View className="flex-1 bg-gray-100">
                <View className="bg-blue-600 p-4 flex-row justify-between items-center">
                    <Text className="text-white text-xl font-bold">Home</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text className="text-white">Logout</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="p-4">
                    <Text className="text-2xl font-bold text-gray-800 mb-6">Welcome to your App!</Text>

                    <View className="bg-white p-6 rounded-lg shadow-sm mb-6">
                        <Text className="text-lg font-semibold text-gray-800 mb-2">Dashboard</Text>
                        <Text className="text-gray-600">This is your home screen. You can add various components and features here.</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <View className="bg-white p-4 rounded-lg shadow-sm w-36 items-center">
                            <Text className="text-3xl font-bold text-blue-600">12</Text>
                            <Text className="text-gray-600">Items</Text>
                        </View>

                        <View className="bg-white p-4 rounded-lg shadow-sm w-36 items-center">
                            <Text className="text-3xl font-bold text-green-600">7</Text>
                            <Text className="text-gray-600">Tasks</Text>
                        </View>
                    </View>

                    <View className="mt-8">
                        <Link href="/chatbot" asChild>
                            <TouchableOpacity className="bg-blue-600 p-4 rounded-lg">
                                <Text className="text-white text-center font-semibold">Go to Chat Bot</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}