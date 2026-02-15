import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    Dimensions,
} from "react-native";

export const CalendarGrid = ({ dates, calendarType }) => {
    const isWeb = Platform.OS === "web";
    const windowWidth = Dimensions.get("window").width;
    const isMobileWeb = isWeb && windowWidth < 768;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.getDate();
    };

    const getDayOfWeek = (dateStr) => {
        const date = new Date(dateStr);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[date.getDay()];
    };

    const getDayIndex = (dateStr) => {
        const date = new Date(dateStr);
        return date.getDay();
    };

    // Web calendar view - traditional grid
    const renderWebCalendar = () => {
        const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Get first day of month to calculate empty cells
        const firstDate =
            dates.length > 0 ? new Date(dates[0].gregorian_date) : new Date();
        const firstDayOfWeek = getDayIndex(
            dates[0]?.gregorian_date || new Date(),
        );

        // Create array with empty cells for days before month starts
        const calendarCells = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarCells.push({ empty: true, key: `empty-${i}` });
        }

        // Add actual dates
        dates.forEach((dateInfo, index) => {
            calendarCells.push({
                ...dateInfo,
                empty: false,
                key: `date-${index}`,
            });
        });

        return (
            <ScrollView style={styles.container}>
                <View style={styles.webCalendarContainer}>
                    {/* Day headers */}
                    <View style={styles.weekHeader}>
                        {dayHeaders.map((day) => (
                            <View key={day} style={styles.dayHeaderCell}>
                                <Text style={styles.dayHeaderText}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Calendar grid */}
                    <View style={styles.webGrid}>
                        {calendarCells.map((cell) => {
                            if (cell.empty) {
                                return (
                                    <View
                                        key={cell.key}
                                        style={styles.webEmptyCell}
                                    />
                                );
                            }

                            return (
                                <View key={cell.key} style={styles.webDateCell}>
                                    <View style={styles.webDateHeader}>
                                        <Text style={styles.webGregorianDate}>
                                            {formatDate(cell.gregorian_date)}
                                        </Text>
                                    </View>
                                    <View
                                        style={styles.webRegionalDateContainer}
                                    >
                                        <Text style={styles.webRegionalDate}>
                                            {cell.regional_date || "N/A"}
                                        </Text>
                                    </View>
                                    <Text style={styles.webCalendarLabel}>
                                        {calendarType.charAt(0).toUpperCase() +
                                            calendarType.slice(1)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        );
    };

    // Mobile view - card layout
    const renderMobileCalendar = () => {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.grid}>
                    {dates.map((dateInfo, index) => (
                        <View key={index} style={styles.dateCard}>
                            <View style={styles.dateHeader}>
                                <Text style={styles.gregorianDate}>
                                    {formatDate(dateInfo.gregorian_date)}
                                </Text>
                                <Text style={styles.dayOfWeek}>
                                    {getDayOfWeek(dateInfo.gregorian_date)}
                                </Text>
                            </View>

                            <View style={styles.regionalDateContainer}>
                                <Text style={styles.regionalDate}>
                                    {dateInfo.regional_date || "N/A"}
                                </Text>
                            </View>

                            <Text style={styles.calendarLabel}>
                                {calendarType.charAt(0).toUpperCase() +
                                    calendarType.slice(1)}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    };

    return isWeb && !isMobileWeb ? renderWebCalendar() : renderMobileCalendar();
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Mobile card layout styles
    grid: {
        padding: 16,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    dateCard: {
        width: "30%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dateHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    gregorianDate: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#007AFF",
    },
    dayOfWeek: {
        fontSize: 12,
        color: "#666",
        fontWeight: "600",
    },
    regionalDateContainer: {
        minHeight: 40,
        justifyContent: "center",
        marginBottom: 4,
    },
    regionalDate: {
        fontSize: 13,
        color: "#333",
        lineHeight: 18,
    },
    calendarLabel: {
        fontSize: 10,
        color: "#999",
        textAlign: "right",
        marginTop: 4,
    },
    // Web calendar grid styles
    webCalendarContainer: {
        padding: 20,
        maxWidth: 1200,
        alignSelf: "center",
        width: "100%",
    },
    weekHeader: {
        flexDirection: "row",
        backgroundColor: "#6B4CE6",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: "hidden",
    },
    dayHeaderCell: {
        flex: 1,
        padding: 12,
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "rgba(255,255,255,0.2)",
    },
    dayHeaderText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    webGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    webEmptyCell: {
        width: "14.285%", // 100% / 7 days
        aspectRatio: 1.2,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
        backgroundColor: "#f9f9f9",
    },
    webDateCell: {
        width: "14.285%", // 100% / 7 days
        aspectRatio: 1.2,
        padding: 8,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
        backgroundColor: "#fff",
    },
    webDateHeader: {
        marginBottom: 6,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    webGregorianDate: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#007AFF",
    },
    webRegionalDateContainer: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 4,
    },
    webRegionalDate: {
        fontSize: 12,
        color: "#333",
        lineHeight: 16,
    },
    webCalendarLabel: {
        fontSize: 9,
        color: "#999",
        textAlign: "right",
    },
});