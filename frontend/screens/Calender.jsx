import { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalendar } from "../hooks";
import { useAuth } from "../hooks";
import { CalendarHeader, CalendarGrid } from "../components/calendar";

const CalenderScreen = () => {
    const { user, isAuthenticated } = useAuth();
    const { getCalendarMonth, getMyCalendar, isLoading, error } = useCalendar();

    const [calendarData, setCalendarData] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarType, setCalendarType] = useState("gregorian");
    const [useUserPreference, setUseUserPreference] = useState(false);

    useEffect(() => {
        loadCalendar();
    }, [currentDate, calendarType, useUserPreference]);

    const loadCalendar = async () => {
        try {
            if (useUserPreference && isAuthenticated) {
                const response = await getMyCalendar();
                setCalendarData(response);
                setCalendarType(response.calendar);
            } else {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const response = await getCalendarMonth(
                    year,
                    month,
                    calendarType,
                );
                setCalendarData(response);
            }
        } catch (err) {
            console.error("Failed to load calendar:", err);
        }
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const handleCalendarTypeChange = (type) => {
        setCalendarType(type);
        setUseUserPreference(false);
    };

    const handleMonthYearSelect = (year, month) => {
        const newDate = new Date(year, month - 1, 1);
        setCurrentDate(newDate);
        setUseUserPreference(false);
    };

    const handleUseMyPreference = () => {
        if (isAuthenticated) {
            setUseUserPreference(true);
            setCurrentDate(new Date());
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading calendar...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>
                    Failed to load calendar. Please try again.
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadCalendar}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!calendarData) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>
                    No calendar data available
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CalendarHeader
                calendarType={calendarType}
                year={calendarData.year}
                month={calendarData.month}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onCalendarTypeChange={handleCalendarTypeChange}
                onMonthYearSelect={handleMonthYearSelect}
            />

            {isAuthenticated && !useUserPreference && (
                <TouchableOpacity
                    style={styles.myCalendarButton}
                    onPress={handleUseMyPreference}
                >
                    <Text style={styles.myCalendarButtonText}>
                        📅 Use My Calendar Preference
                    </Text>
                </TouchableOpacity>
            )}

            {useUserPreference && (
                <View style={styles.preferenceIndicator}>
                    <Text style={styles.preferenceText}>
                        Showing your preferred calendar ({calendarData.calendar}
                        )
                    </Text>
                </View>
            )}

            <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                    Total Days: {calendarData.total_days}
                </Text>
                <Text style={styles.statsText}>
                    Calendar:{" "}
                    {calendarType.charAt(0).toUpperCase() +
                        calendarType.slice(1)}
                </Text>
            </View>

            <CalendarGrid
                dates={calendarData.dates || []}
                calendarType={calendarType}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7fa",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#d32f2f",
        marginBottom: 20,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    myCalendarButton: {
        backgroundColor: "#4CAF50",
        padding: 12,
        margin: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    myCalendarButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    preferenceIndicator: {
        backgroundColor: "#e3f2fd",
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    preferenceText: {
        color: "#1976d2",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 12,
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statsText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "600",
    },
});

export default CalenderScreen;