import { View, Text, StyleSheet, ScrollView } from "react-native";

export const CalendarGrid = ({ dates, calendarType }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

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
              {calendarType.charAt(0).toUpperCase() + calendarType.slice(1)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
});
