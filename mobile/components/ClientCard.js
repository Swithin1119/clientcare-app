import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ClientCard({ client, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {client.name?.charAt(0)?.toUpperCase() || "?"}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {client.name}
        </Text>

        <Text style={styles.details}>
          {client.age} years • {client.gender}
        </Text>

        <Text style={styles.diagnosis} numberOfLines={1}>
          {client.diagnosis}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,

    shadowColor: "#171A2B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,

    elevation: 3,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#5B5FEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  content: {
    flex: 1,
  },

  name: {
    fontSize: 14,
    fontWeight: "900",
    color: "#171A2B",
  },

  details: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 3,
  },

  diagnosis: {
    fontSize: 10,
    color: "#5B5FEF",
    fontWeight: "700",
    marginTop: 5,
  },

  arrow: {
    fontSize: 27,
    color: "#9CA3AF",
    marginLeft: 8,
  },
});