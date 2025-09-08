// app/season/[id].jsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { seasonData } from '../seasonData.js';

export default function SeasonDetail() {
    const { id } = useLocalSearchParams();
    const season = seasonData[id];
    
    if (!season) {
        return (
            <SafeAreaView>
                <View>
                    <Text>Season not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 bg-gray-100">
                {/* Header */}
                <View className="bg-amber-600 p-4 flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-white">← पीछे</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">{season.hindiName}</Text>
                    <View style={{ width: 60 }}></View>
                </View>

                <ScrollView className="p-4">
                    <View className="items-center mb-6">
                        <Text className="text-3xl font-bold text-amber-800">{season.hindiName}</Text>
                        <Text className="text-lg text-gray-600">{season.englishName}</Text>
                        <Text className="text-md text-gray-500">{season.period}</Text>
                    </View>
                    
                    <View className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                        <Text className="text-xl font-bold text-amber-800 mb-4">कविता</Text>
                        <Text className="text-gray-800 text-lg leading-8">{season.poem}</Text>
                    </View>
                    
                    <View className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                        <Text className="text-xl font-bold text-amber-800 mb-4">अर्थ</Text>
                        <Text className="text-gray-800 text-lg leading-8">{season.meaning}</Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}