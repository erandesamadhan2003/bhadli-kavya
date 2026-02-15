import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
} from "react-native";
import { useState } from "react";

export const CalendarHeader = ({
    calendarType,
    year,
    month,
    onPrevMonth,
    onNextMonth,
    onCalendarTypeChange,
    onMonthYearSelect,
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(year);
    const [selectedMonth, setSelectedMonth] = useState(month);

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

    // Generate years (current year ± 50 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

    const handleOpenPicker = () => {
        setSelectedYear(year);
        setSelectedMonth(month);
        setShowPicker(true);
    };

    const handleApplySelection = () => {
        onMonthYearSelect(selectedYear, selectedMonth);
        setShowPicker(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.monthSelector}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={onPrevMonth}
                >
                    <Text style={styles.navButtonText}>‹</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleOpenPicker}>
                    <Text style={styles.monthText}>
                        {monthNames[month - 1]} {year}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={onNextMonth}
                >
                    <Text style={styles.navButtonText}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.calendarTypeSelector}>
                {calendarTypes.map((type) => (
                    <TouchableOpacity
                        key={type.value}
                        style={[
                            styles.typeButton,
                            calendarType === type.value &&
                                styles.typeButtonActive,
                        ]}
                        onPress={() => onCalendarTypeChange(type.value)}
                    >
                        <Text
                            style={[
                                styles.typeButtonText,
                                calendarType === type.value &&
                                    styles.typeButtonTextActive,
                            ]}
                        >
                            {type.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Modal
                visible={showPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.pickerContainer}>
                        <View style={styles.pickerHeader}>
                            <Text style={styles.pickerTitle}>
                                Select Month & Year
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowPicker(false)}
                            >
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.pickersRow}>
                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerLabel}>Month</Text>
                                <ScrollView style={styles.scrollPicker}>
                                    {monthNames.map((monthName, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.pickerItem,
                                                selectedMonth === index + 1 &&
                                                    styles.pickerItemSelected,
                                            ]}
                                            onPress={() =>
                                                setSelectedMonth(index + 1)
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.pickerItemText,
                                                    selectedMonth ===
                                                        index + 1 &&
                                                        styles.pickerItemTextSelected,
                                                ]}
                                            >
                                                {monthName}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerLabel}>Year</Text>
                                <ScrollView style={styles.scrollPicker}>
                                    {years.map((yearOption) => (
                                        <TouchableOpacity
                                            key={yearOption}
                                            style={[
                                                styles.pickerItem,
                                                selectedYear === yearOption &&
                                                    styles.pickerItemSelected,
                                            ]}
                                            onPress={() =>
                                                setSelectedYear(yearOption)
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.pickerItemText,
                                                    selectedYear ===
                                                        yearOption &&
                                                        styles.pickerItemTextSelected,
                                                ]}
                                            >
                                                {yearOption}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.pickerActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowPicker(false)}
                            >
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={handleApplySelection}
                            >
                                <Text style={styles.applyButtonText}>
                                    Apply
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#6B4CE6",
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
        color: "#6B4CE6",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    pickerContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        width: "85%",
        maxHeight: "70%",
        padding: 20,
    },
    pickerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        fontSize: 24,
        color: "#666",
        fontWeight: "bold",
    },
    pickersRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    pickerColumn: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 8,
        textAlign: "center",
    },
    scrollPicker: {
        maxHeight: 250,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
    },
    pickerItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        alignItems: "center",
    },
    pickerItemSelected: {
        backgroundColor: "#6B4CE6",
    },
    pickerItemText: {
        fontSize: 14,
        color: "#333",
    },
    pickerItemTextSelected: {
        color: "#fff",
        fontWeight: "600",
    },
    pickerActions: {
        flexDirection: "row",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#6B4CE6",
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#6B4CE6",
        fontSize: 16,
        fontWeight: "600",
    },
    applyButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        backgroundColor: "#6B4CE6",
        alignItems: "center",
    },
    applyButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});