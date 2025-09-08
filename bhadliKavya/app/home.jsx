import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
    const handleLogout = () => {
        // Here you would typically handle logout logic
        router.push('/');
    };

    // Data for the 6 seasons of India
    const seasons = [
        {
            id: 1,
            hindiName: 'वसंत',
            englishName: 'Vasant (Spring)',
            period: 'मध्य फरवरी - मध्य अप्रैल',
            color: '#FFD700' // Golden yellow
        },
        {
            id: 2,
            hindiName: 'ग्रीष्म',
            englishName: 'Grishma (Summer)',
            period: 'मध्य अप्रैल - मध्य जून',
            color: '#FF8C00' // Dark orange
        },
        {
            id: 3,
            hindiName: 'वर्षा',
            englishName: 'Varsha (Monsoon)',
            period: 'मध्य जून - मध्य अगस्त',
            color: '#0066CC' // Blue
        },
        {
            id: 4,
            hindiName: 'शरद',
            englishName: 'Sharad (Autumn)',
            period: 'मध्य अगस्त - मध्य अक्टूबर',
            color: '#8A2BE2' // Blue violet
        },
        {
            id: 5,
            hindiName: 'हेमंत',
            englishName: 'Hemant (Pre-Winter)',
            period: 'मध्य अक्टूबर - मध्य दिसंबर',
            color: '#8B4513' // Saddle brown
        },
        {
            id: 6,
            hindiName: 'शिशिर',
            englishName: 'Shishir (Winter)',
            period: 'मध्य दिसंबर - मध्य फरवरी',
            color: '#4682B4' // Steel blue
        }
    ];

    const navigateToSeason = (seasonId) => {
        router.push({
            pathname: "/season/[id]",
            params: { id: seasonId }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 bg-gray-100">
                {/* Header */}
                <View className="bg-amber-600 p-4 flex-row justify-between items-center">
                    <Text className="text-white text-xl font-bold">Home</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text className="text-white">LogOut</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="p-4">
                    {/* Welcome Section */}
                    <View className="items-center mb-6">
                        <Text className="text-3xl font-bold text-amber-800 mb-2">भदली कव्या</Text>
                        <Text className="text-lg text-gray-600 text-center">भारत की छह ऋतुओं की सुंदरता का अन्वेषण करें</Text>
                    </View>

                    {/* Introduction Card */}
                    <View className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-amber-100">
                        <Text className="text-lg font-semibold text-amber-800 mb-2">भारत की ऋतुएँ</Text>
                        <Text className="text-gray-600">
                            भारत में छह मुख्य ऋतुएँ होती हैं, जिनमें से प्रत्येक की अपनी विशेषताएँ, सौंदर्य और सांस्कृतिक महत्व है।
                            प्रत्येक ऋतु पर क्लिक करके उसके बारे में अधिक जानें, कविताएँ पढ़ें और उनका अर्थ समझें।
                        </Text>
                    </View>

                    {/* Seasons Grid */}
                    <Text className="text-xl font-bold text-amber-800 mb-4">ऋतुएँ</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {seasons.map((season) => (
                            <TouchableOpacity
                                key={season.id}
                                onPress={() => navigateToSeason(season.id)}
                                className="w-[48%] bg-white rounded-2xl shadow-sm mb-4 overflow-hidden border"
                                style={{ borderColor: season.color }}
                            >
                                <View
                                    className="h-32 flex justify-center items-center"
                                    style={{ backgroundColor: season.color + '40' }} // Adding opacity
                                >
                                    <Text className="text-4xl font-bold text-gray-800">
                                        {season.hindiName}
                                    </Text>
                                </View>
                                <View className="p-3">
                                    <Text className="font-semibold text-gray-800">{season.englishName}</Text>
                                    <Text className="text-xs text-gray-500">{season.period}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Additional Features */}
                    <View className="mt-8">
                        <TouchableOpacity 
                            onPress={() => router.push('/chatbot')}
                            className="bg-amber-600 p-4 rounded-lg"
                        >
                            <Text className="text-white text-center font-semibold">कविता बॉट से बात करें</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}