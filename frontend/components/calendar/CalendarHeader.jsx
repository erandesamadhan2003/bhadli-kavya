import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const CalendarHeader = ({
  calendarType,
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onCalendarTypeChange,
}) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const calendarTypes = [
    { value: "gregorian", label: "Gregorian" },
    { value: "hindi", label: "Hindi" },
    { value: "gujarati", label: "Gujarati" },
    { value: "bengali", label: "Bengali" },
    { value: "rajasthani", label: "Rajasthani" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.monthSelector}>
        <TouchableOpacity style={styles.navButton} onPress={onPrevMonth}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {monthNames[month - 1]} {year}
        </Text>

        <TouchableOpacity style={styles.navButton} onPress={onNextMonth}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarTypeSelector}>
        {calendarTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.typeButton,
              calendarType === type.value && styles.typeButtonActive,
            ]}
            onPress={() => onCalendarTypeChange(type.value)}
          >
            <Text
              style={[
                styles.typeButtonText,
                calendarType === type.value && styles.typeButtonTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  calendarTypeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
  },
  typeButtonActive: {
    backgroundColor: "#fff",
  },
  typeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: "#007AFF",
  },
});
