import { StyleSheet } from "react-native";

import {
  COLORS,
  SHADOW,
  RADIUS,
  SPACING,
} from "../theme";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
    ...SHADOW.small,
  },

  backArrow: {
    fontSize: 34,
    color: COLORS.text,
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: COLORS.text,
  },

  profileCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: 28,
    alignItems: "center",
    marginBottom: SPACING.xxl,
    ...SHADOW.medium,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  avatarText: {
    fontSize: 31,
    fontWeight: "900",
    color: COLORS.primary,
  },

  name: {
    fontSize: 23,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
  },

  profileSubtitle: {
    fontSize: 9,
    color: "#E8E9FF",
    marginTop: 6,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 10,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.large,
    paddingHorizontal: 18,
    marginBottom: SPACING.xxl,
    ...SHADOW.small,
  },

  infoRow: {
    paddingVertical: 16,
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F4",
  },

  label: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "700",
    marginBottom: 5,
  },

  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "700",
  },

  bottomButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: COLORS.text,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  bottomButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  errorText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
});