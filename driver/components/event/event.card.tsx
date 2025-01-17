import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import color from "@/themes/app.colors";

interface EventCardProps {
  event: {
    title: string;
    date: string;
    description: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.description}>{event.description}</Text>
    </TouchableOpacity>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: color.whiteColor,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: color.primaryText,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: color.secondaryFont,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: color.secondaryFont,
  },
});
