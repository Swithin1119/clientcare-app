import { StyleSheet } from "react-native";

import {
  COLORS,
  SHADOW,
  RADIUS,
  SPACING,
} from "../theme";

export default StyleSheet.create({
  lightSafe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* LOGIN */

  loginBackground: {
    flex: 1,
  },

  loginScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 45,
  },

  glowOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(91,95,239,0.15)",
    top: -70,
    right: -80,
  },

  glowTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(139,92,246,0.12)",
    bottom: 80,
    left: -80,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.large,
  },

  logoCross: {
    color: COLORS.white,
    fontSize: 43,
    fontWeight: "300",
  },

  brand: {
    color: COLORS.white,
    fontSize: 31,
    fontWeight: "900",
    textAlign: "center",
  },

  brandSub: {
    color: "#C4C7FF",
    fontSize: 9,
    letterSpacing: 2.4,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 28,
  },

  glassCard: {
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  glassOverlay: {
    padding: 25,
    backgroundColor: "rgba(255,255,255,0.055)",
  },

  welcome: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "900",
  },

  loginSubtitle: {
    color: "#A8AEBD",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
    marginBottom: 22,
  },

  inputLabel: {
    color: "#A7AEC2",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 13,
  },

  glassInput: {
    height: 56,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    backgroundColor: "rgba(0,0,0,0.16)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  inputPrefix: {
    color: "#A9ACFF",
    fontWeight: "800",
    marginRight: 12,
  },

  lock: {
    color: "#A9ACFF",
    fontSize: 24,
    marginRight: 10,
  },

  darkInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },

  eye: {
    color: "#A9ACFF",
    fontSize: 20,
  },

  signIn: {
    height: 57,
    borderRadius: 18,
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW.medium,
  },

  signInText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  signArrow: {
    color: COLORS.white,
    fontSize: 23,
    marginLeft: 13,
  },

  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.09)",
  },

  securityIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(22,163,74,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  securityTitle: {
    color: "#E1E4ED",
    fontSize: 11,
    fontWeight: "800",
  },

  securitySub: {
    color: "#788094",
    fontSize: 9,
    marginTop: 2,
  },

  footerText: {
    textAlign: "center",
    color: "#646B80",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 22,
  },

  /* DASHBOARD */

  dashboardScroll: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 35,
  },

  dashboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  smallGreeting: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  dashboardTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 4,
  },

  dashboardSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },

  profile: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: COLORS.text,
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#B9BCFF",
    fontSize: 19,
    fontWeight: "900",
  },

  search: {
    height: 54,
    backgroundColor: COLORS.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 16,
    ...SHADOW.small,
  },

  searchIcon: {
    color: COLORS.primary,
    fontSize: 24,
    marginRight: 9,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },

  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  stat: {
    flex: 1,
    height: 145,
    borderRadius: 23,
    padding: 18,
    justifyContent: "space-between",
  },

  statIcon: {
    color: "#C7C9FF",
    fontSize: 24,
  },

  statNumber: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "900",
  },

  statLabel: {
    color: "#D5D7FF",
    fontSize: 11,
    fontWeight: "700",
  },

  statLight: {
    flex: 1,
    height: 145,
    borderRadius: 23,
    padding: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "space-between",
    ...SHADOW.small,
  },

  statLightIcon: {
    color: COLORS.primary,
    fontSize: 24,
  },

  statLightNumber: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
  },

  statLightLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },

  addCard: {
    borderRadius: 23,
    minHeight: 88,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  plusCircle: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  plus: {
    color: COLORS.white,
    fontSize: 28,
  },

  addTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
  },

  addSub: {
    color: "#DDDFFF",
    fontSize: 10,
    marginTop: 3,
  },

  cardArrow: {
    color: COLORS.white,
    fontSize: 25,
  },

  viewCard: {
    minHeight: 82,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 25,
    ...SHADOW.small,
  },

  viewIcon: {
    width: 47,
    height: 47,
    borderRadius: 16,
    backgroundColor: "#EEEEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  viewIconText: {
    color: COLORS.primary,
    fontSize: 22,
  },

  viewTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "900",
  },

  viewSub: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },

  darkArrow: {
    color: COLORS.primary,
    fontSize: 25,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 11,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },

  viewAll: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "900",
  },

  clientCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: "#EEEEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "900",
  },

  clientName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "900",
  },

  clientMeta: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 3,
  },

  clientDiagnosis: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
  },

  clientDate: {
    color: COLORS.textLight,
    fontSize: 9,
    marginTop: 3,
  },

  clientArrow: {
    color: COLORS.textLight,
    fontSize: 25,
  },

  empty: {
    backgroundColor: COLORS.white,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  bottomNav: {
    backgroundColor: COLORS.white,
    minHeight: 70,
    borderRadius: 23,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.small,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    color: COLORS.textLight,
    fontSize: 20,
  },

  navText: {
    color: COLORS.textLight,
    fontSize: 9,
    marginTop: 4,
  },

  navActive: {
    alignItems: "center",
  },

  navActiveIcon: {
    color: COLORS.primary,
    fontSize: 21,
  },

  navActiveText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "900",
    marginTop: 4,
  },

  logout: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 13,
  },

  logoutText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },

  /* ADD CLIENT */

  formScroll: {
    padding: 18,
    paddingBottom: 40,
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  backText: {
    color: COLORS.text,
    fontSize: 32,
    marginTop: -3,
  },

  pageTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: "900",
  },

  pageSub: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },

  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 23,
    padding: 19,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.small,
  },

  formHeading: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },

  lightLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 7,
  },

  dateBox: {
    height: 51,
    borderRadius: 15,
    backgroundColor: "#EEEEFF",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  dateText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  lightInput: {
    height: 51,
    borderRadius: 15,
    backgroundColor: "#F8F9FD",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontSize: 13,
  },

  textArea: {
    height: 85,
    paddingTop: 13,
    textAlignVertical: "top",
  },

  bigTextArea: {
    height: 105,
    paddingTop: 13,
    textAlignVertical: "top",
  },

  genderRow: {
    flexDirection: "row",
    gap: 8,
  },

  gender: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F8F9FD",
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },

  genderActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  genderText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "800",
  },

  genderTextActive: {
    color: COLORS.white,
  },

  formButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 3,
  },

  cancelBtn: {
    flex: 1,
    height: 55,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },

  saveBtn: {
    height: 55,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
});