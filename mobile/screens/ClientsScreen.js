import React, { useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import ClientCard from "../components/ClientCard";

import styles from "../styles/ClientsStyles";

export default function ClientsScreen({
  clients = [],
  onBack,
  onClientPress,
}) {
  const [search, setSearch] = useState("");

  const searchText = search.toLowerCase().trim();

  const filteredClients = clients.filter(
    (client) => {
      if (!searchText) {
        return true;
      }

      return [
        client?.name,
        client?.age,
        client?.gender,
        client?.address,
        client?.phc,
        client?.diagnosis,
        client?.treatment,
        client?.date,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

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
          >
            <Text style={styles.backArrow}>
              ‹
            </Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Clients
            </Text>

            <Text style={styles.subtitle}>
              {clients.length} registered clients
            </Text>
          </View>

          <View style={styles.countCircle}>
            <Text style={styles.countText}>
              {clients.length}
            </Text>
          </View>
        </View>

        {/* SEARCH */}

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>
            🔍
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search client..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
            >
              <Text style={styles.clear}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* RESULT */}

        <View style={styles.resultRow}>
          <Text style={styles.resultText}>
            {filteredClients.length} result
            {filteredClients.length !== 1
              ? "s"
              : ""}
          </Text>

          {search.length > 0 && (
            <Text style={styles.searchingText}>
              Searching...
            </Text>
          )}
        </View>

        {/* CLIENTS */}

        {filteredClients.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>
              🔎
            </Text>

            <Text style={styles.emptyTitle}>
              No clients found
            </Text>

            <Text style={styles.emptyText}>
              Try another name, PHC or diagnosis.
            </Text>
          </View>
        ) : (
          filteredClients.map((client, index) => (
            <ClientCard
              key={
                client?._id ||
                client?.id ||
                `client-${index}`
              }
              client={client}
              onPress={() =>
                onClientPress(client)
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}