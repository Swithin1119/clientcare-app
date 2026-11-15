import React from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "https://clientcare-server.onrender.com";

export default function ClientDetailsScreen({
  client,
  onBack,
  onDelete,
}) {
  if (!client) {
    return null;
  }

  const clientId = client._id || client.id;

  const handleDelete = () => {
    if (!clientId) {
      Alert.alert("Error", "Client ID not found.");
      return;
    }

    const deleteClient = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/clients/${clientId}`,
          {
            method: "DELETE",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || result.message || "Failed to delete client"
          );
        }

        Alert.alert(
          "Deleted",
          "Client record deleted successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                if (onDelete) {
                  onDelete(clientId);
                } else {
                  onBack();
                }
              },
            },
          ]
        );
      } catch (error) {
        console.log("DELETE CLIENT ERROR:", error);

        Alert.alert(
          "Delete Failed",
          error.message || "Unable to delete client."
        );
      }
    };

    // WEB
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${client.name}'s record?\n\nThis action cannot be undone.`
      );

      if (confirmed) {
        deleteClient();
      }

      return;
    }

    // ANDROID / IOS
    Alert.alert(
      "Delete Client",
      `Are you sure you want to delete ${client.name}'s record?\n\nThis action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteClient,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Client Details
          </Text>
        </View>

        {/* PROFILE CARD */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {client.name?.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>
            {client.name}
          </Text>

          <Text style={styles.profileSubtitle}>
            Client ID #{clientId}
          </Text>
        </View>

        {/* PERSONAL INFORMATION */}

        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <View style={styles.card}>
          <InfoRow
            label="Date"
            value={client.date}
          />

          <InfoRow
            label="Name"
            value={client.name}
          />

          <InfoRow
            label="Age"
            value={`${client.age} years`}
          />

          <InfoRow
            label="Gender"
            value={client.gender}
          />

          <InfoRow
            label="Address"
            value={client.address}
            last
          />
        </View>

        {/* MEDICAL INFORMATION */}

        <Text style={styles.sectionTitle}>
          Medical Information
        </Text>

        <View style={styles.card}>
          <InfoRow
            label="PHC / HSC"
            value={client.phc}
          />

          <InfoRow
            label="Diagnosis"
            value={client.diagnosis}
          />

          <InfoRow
            label="Treatment"
            value={client.treatment}
            last
          />
        </View>

        {/* BACK BUTTON */}

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Text style={styles.bottomButtonText}>
            Back to Clients
          </Text>
        </TouchableOpacity>

        {/* DELETE BUTTON */}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteIcon}>
            🗑
          </Text>

          <Text style={styles.deleteButtonText}>
            Delete Client
          </Text>
        </TouchableOpacity>

        <Text style={styles.warningText}>
          Deleting this client will permanently remove
          the record from the database.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// INFO ROW
// ======================================================

function InfoRow({
  label,
  value,
  last,
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && styles.borderBottom,
      ]}
    >
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value || "-"}
      </Text>
    </View>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FC",
  },

  container: {
    padding: 18,
    paddingBottom: 45,
  },

  // HEADER

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,

    shadowColor: "#171A2B",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  backArrow: {
    fontSize: 34,
    color: "#171A2B",
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#171A2B",
  },

  // PROFILE

  profileCard: {
    backgroundColor: "#5B5FEF",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    marginBottom: 25,

    shadowColor: "#5B5FEF",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,

    elevation: 7,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#5B5FEF",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  profileSubtitle: {
    fontSize: 9,
    color: "#E6E7FF",
    marginTop: 5,
    textAlign: "center",
  },

  // SECTION

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#171A2B",
    marginBottom: 10,
  },

  // CARD

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 17,
    marginBottom: 22,

    shadowColor: "#171A2B",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 3,
  },

  infoRow: {
    paddingVertical: 16,
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F3",
  },

  label: {
    fontSize: 10,
    color: "#9298A1",
    fontWeight: "600",
    marginBottom: 5,
  },

  value: {
    fontSize: 14,
    color: "#20242A",
    fontWeight: "700",
  },

  // BACK

  bottomButton: {
    height: 52,
    borderRadius: 17,
    backgroundColor: "#171A2B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  bottomButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  // DELETE

  deleteButton: {
    height: 52,
    borderRadius: 17,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
  },

  deleteIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  warningText: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 9,
    lineHeight: 15,
  },
});