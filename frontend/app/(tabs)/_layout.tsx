import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#4A90E2',
                tabBarInactiveTintColor: '#6c757d',
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarItemStyle: styles.tabBarItem,
                tabBarBackground: () => (
                    <View style={styles.tabBarBackground} />
                ),
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{
                    title: 'HOME',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={[styles.iconGlow, { color }]}>🏠</Text>
                    ),
                }}
            />
            <Tabs.Screen 
                name="chat" 
                options={{
                    title: 'CHAT',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={[styles.iconGlow, { color }]}>🤖</Text>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#ffffff',
        borderTopWidth: 2,
        borderTopColor: '#4A90E2',
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    tabBarItem: {
        borderRadius: 15,
        marginHorizontal: 5,
        backgroundColor: 'rgba(74,144,226,0.1)',
    },
    tabBarBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
    },
    iconGlow: {
        fontSize: 24,
    },
});