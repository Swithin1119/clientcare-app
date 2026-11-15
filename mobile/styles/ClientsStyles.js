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

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  countCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  countText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
  },

  searchBox: {
    height: 56,
    borderRadius: RADIUS.medium,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.small,
  },

  searchIcon: {
    fontSize: 17,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },

  clear: {
    fontSize: 16,
    color: COLORS.textSecondary,
    padding: 5,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },

  resultText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },

  searchingText: {
    fontSize: 10,
    color: COLORS.primary,
  },

  emptyBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.large,
    padding: 35,
    alignItems: "center",
    marginTop: SPACING.xl,
    ...SHADOW.small,
  },

  emptyIcon: {
    fontSize: 38,
    marginBottom: SPACING.md,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
  },

  emptyText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 17,
  },
});