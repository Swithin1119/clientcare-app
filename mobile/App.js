import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

// =====================================================
// API & COLORS
// =====================================================

const API_URL = "https://clientcare-server.onrender.com";

const COLORS = {
  primary: "#5B5FEF",
  primaryDark: "#4649C8",
  background: "#F5F7FC",
  surface: "#FFFFFF",
  text: "#171A2B",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",
  border: "#E7E9F2",
  success: "#16A34A",
  danger: "#EF4444",
  white: "#FFFFFF",
};

const getCurrentDate = () => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;
};

const isValidDate = (value) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value || "")) return false;
  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const dateToNumber = (value) => {
  if (!isValidDate(value)) return null;
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

// =====================================================
// MAIN APP
// =====================================================

export default function App() {
  // Login
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // App state
  const [screen, setScreen] = useState("dashboard");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");

  // Search
  const [searchText, setSearchText] = useState("");

  // Client form
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [phc, setPhc] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [clientDate, setClientDate] = useState(getCurrentDate());

  // Export
  const [showExport, setShowExport] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const showMessage = (title, message) => {
    if (Platform.OS === "web") window.alert(`${title}\n\n${message}`);
    else Alert.alert(title, message);
  };

  const handleLogin = async () => {
    if (!loginPhone.trim()) return showMessage("Required", "Please enter phone number.");
    if (!loginPassword) return showMessage("Required", "Please enter password.");

    try {
      setLoginLoading(true);
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: loginPhone.trim(),
          password: loginPassword,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid phone number or password.");
      }
      setLoggedIn(true);
      setLoginPhone("");
      setLoginPassword("");
    } catch (error) {
      showMessage("Login Failed", error.message || "Unable to login.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    const logout = () => {
      setLoggedIn(false);
      setScreen("dashboard");
      setSelectedClient(null);
      resetForm();
    };

    if (Platform.OS === "web") {
      if (window.confirm("Do you want to logout?")) logout();
    } else {
      Alert.alert("Logout", "Do you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]);
    }
  };

  const fetchClients = async (quiet = false) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/clients`);
      if (!response.ok) throw new Error("Failed to fetch clients.");
      const data = await response.json();
      setClients(Array.isArray(data) ? data : []);
      setServerStatus("online");
    } catch (error) {
      setServerStatus("offline");
      if (!quiet) showMessage("Connection Error", "Unable to connect to ClientCare server.");
    } finally {
      setLoading(false);
    }
  };

  const checkServer = async () => {
    try {
      const response = await fetch(API_URL);
      setServerStatus(response.ok ? "online" : "offline");
    } catch {
      setServerStatus("offline");
    }
  };

  useEffect(() => {
    if (loggedIn) {
      checkServer();
      fetchClients();
    }
  }, [loggedIn]);

  const resetForm = () => {
    setName("");
    setAge("");
    setGender("");
    setPhone("");
    setAddress("");
    setPhc("");
    setDiagnosis("");
    setTreatment("");
    setClientDate(getCurrentDate());
    setIsEditing(false);
  };

  const openAddClient = () => {
    resetForm();
    setSelectedClient(null);
    setScreen("add");
  };

  const startEditClient = (client) => {
    setSelectedClient(client);
    setName(client.name || "");
    setAge(String(client.age ?? ""));
    setGender(client.gender || "");
    setPhone(client.phone || "");
    setAddress(client.address || "");
    setPhc(client.phc || "");
    setDiagnosis(client.diagnosis || "");
    setTreatment(client.treatment || "");
    setClientDate(client.date || getCurrentDate());
    setIsEditing(true);
    setScreen("add");
  };

  const handleSaveClient = async () => {
    if (!name.trim()) return showMessage("Required", "Please enter client name.");
    if (!age.trim()) return showMessage("Required", "Please enter age.");

    const numericAge = Number(age);
    if (!Number.isInteger(numericAge) || numericAge <= 0 || numericAge > 120) {
      return showMessage("Invalid Age", "Please enter a valid age.");
    }
    if (!gender) return showMessage("Required", "Please select gender.");
    if (!address.trim()) return showMessage("Required", "Please enter address.");
    if (!phc.trim()) return showMessage("Required", "Please enter PHC / HSC.");
    if (!diagnosis.trim()) return showMessage("Required", "Please enter diagnosis.");
    if (!treatment.trim()) return showMessage("Required", "Please enter treatment.");
    if (!clientDate.trim() || !isValidDate(clientDate.trim())) {
      return showMessage("Invalid Date", "Please enter date in DD/MM/YYYY format. Example: 21/08/2026");
    }

    const clientData = {
      name: name.trim(),
      age: numericAge,
      gender,
      phone: phone.trim(),
      address: address.trim(),
      phc: phc.trim(),
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim(),
      date: clientDate.trim(),
    };

    const editing = isEditing;
    const editingId = selectedClient?._id || selectedClient?.id;

    try {
      setSaving(true);
      const response = await fetch(
        editing ? `${API_URL}/api/clients/${editingId}` : `${API_URL}/api/clients`,
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clientData),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to save client.");
      }

      if (editing) {
        const updatedClient = result.client;
        if (updatedClient) {
          setClients((previous) =>
            previous.map((item) =>
              (item._id || item.id) === editingId ? updatedClient : item
            )
          );
          setSelectedClient(updatedClient);
        } else {
          await fetchClients(true);
        }
      } else if (result.client) {
        setClients((previous) => [result.client, ...previous]);
      } else {
        await fetchClients(true);
      }

      resetForm();
      setScreen("dashboard");
      showMessage("Success", editing ? "Client details updated successfully." : "Client added successfully.");
    } catch (error) {
      showMessage("Save Error", error.message || "Unable to save client.");
    } finally {
      setSaving(false);
    }
  };

  const deleteClient = async (clientId) => {
    if (!clientId) return;

    const performDelete = async () => {
      try {
        const response = await fetch(`${API_URL}/api/clients/${clientId}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || result.message || "Failed to delete client.");

        setClients((previous) =>
          previous.filter((client) => (client._id || client.id) !== clientId)
        );
        setSelectedClient(null);
        setScreen("clients");
        showMessage("Deleted", "Client deleted successfully.");
      } catch (error) {
        showMessage("Delete Error", error.message || "Unable to delete client.");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to permanently delete this client?")) {
        await performDelete();
      }
    } else {
      Alert.alert("Delete Client", "Are you sure you want to permanently delete this client?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: performDelete },
      ]);
    }
  };

  const openClient = (client) => {
    setSelectedClient(client);
    setScreen("details");
  };

  const filteredClients = useMemo(() => {
    const value = searchText.trim().toLowerCase();
    if (!value) return clients;
    return clients.filter((client) =>
      [client.name, client.phone, client.address, client.diagnosis, client.phc]
        .some((field) => String(field || "").toLowerCase().includes(value))
    );
  }, [clients, searchText]);

  const getExportClients = () => {
    if (!fromDate.trim() || !toDate.trim()) {
      showMessage("Date Required", "Please enter both From Date and To Date.");
      return null;
    }
    if (!isValidDate(fromDate.trim())) {
      showMessage("Invalid From Date", "Use DD/MM/YYYY format.");
      return null;
    }
    if (!isValidDate(toDate.trim())) {
      showMessage("Invalid To Date", "Use DD/MM/YYYY format.");
      return null;
    }

    const start = dateToNumber(fromDate.trim());
    const end = dateToNumber(toDate.trim());
    if (start > end) {
      showMessage("Invalid Range", "From Date cannot be after To Date.");
      return null;
    }

    const records = clients.filter((client) => {
      const value = dateToNumber(String(client.date || ""));
      return value !== null && value >= start && value <= end;
    });

    if (!records.length) {
      showMessage("No Records", `No clients found between ${fromDate} and ${toDate}.`);
      return null;
    }
    return records;
  };

  const makeExportRows = (records) =>
    records.map((client, index) => ({
      "S.No": index + 1,
      Name: client.name || "",
      Age: client.age ?? "",
      Gender: client.gender || "",
      "Phone Number": client.phone || "",
      Address: client.address || "",
      "PHC / HSC": client.phc || "",
      Diagnosis: client.diagnosis || "",
      Treatment: client.treatment || "",
      Date: client.date || "",
    }));

  const handleExportExcel = async () => {
    const records = getExportClients();
    if (!records) return;

    try {
      setExporting(true);
      const worksheet = XLSX.utils.json_to_sheet(makeExportRows(records));
      worksheet["!cols"] = [
        { wch: 7 }, { wch: 22 }, { wch: 8 }, { wch: 12 }, { wch: 16 },
        { wch: 28 }, { wch: 18 }, { wch: 25 }, { wch: 25 }, { wch: 14 },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Client Records");

      const base64 = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
      const fileName = `ClientCare_${fromDate.replaceAll("/", "-")}_to_${toDate.replaceAll("/", "-")}.xlsx`;

      if (Platform.OS === "web") {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            dialogTitle: "Export Client Records",
            UTI: "com.microsoft.excel.xlsx",
          });
        } else {
          showMessage("Excel Created", fileUri);
        }
      }

      setShowExport(false);
      showMessage("Export Complete", `${records.length} client records exported to Excel.`);
    } catch (error) {
      showMessage("Excel Export Error", error.message || "Unable to export Excel file.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    const records = getExportClients();
    if (!records) return;

    try {
      setExporting(true);
      const rows = records.map((client, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(client.name)}</td>
          <td>${escapeHtml(client.age)}</td>
          <td>${escapeHtml(client.gender)}</td>
          <td>${escapeHtml(client.phone)}</td>
          <td>${escapeHtml(client.address)}</td>
          <td>${escapeHtml(client.phc)}</td>
          <td>${escapeHtml(client.diagnosis)}</td>
          <td>${escapeHtml(client.treatment)}</td>
          <td>${escapeHtml(client.date)}</td>
        </tr>
      `).join("");

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              @page { size: A4 landscape; margin: 12mm; }
              body { font-family: Arial, sans-serif; color: #171A2B; }
              h2 { text-align: center; color: #4649C8; margin-bottom: 6px; }
              .meta { text-align: center; font-size: 11px; margin-bottom: 18px; }
              table { width: 100%; border-collapse: collapse; font-size: 8px; }
              th, td { border: 1px solid #cfd2df; padding: 5px; text-align: left; vertical-align: top; }
              th { background: #EEF0FF; }
              tr { page-break-inside: avoid; }
            </style>
          </head>
          <body>
            <h2>CLIENTCARE - Client Records</h2>
            <div class="meta">
              From: ${escapeHtml(fromDate)} &nbsp; To: ${escapeHtml(toDate)}
              &nbsp; | &nbsp; Total Records: ${records.length}
            </div>
            <table>
              <thead>
                <tr>
                  <th>S.No</th><th>Name</th><th>Age</th><th>Gender</th>
                  <th>Phone</th><th>Address</th><th>PHC / HSC</th>
                  <th>Diagnosis</th><th>Treatment</th><th>Date</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </body>
        </html>
      `;

      if (Platform.OS === "web") {
        const printWindow = window.open("", "_blank");
        if (!printWindow) throw new Error("Please allow pop-ups in your browser to create the PDF.");
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } else {
        const file = await Print.printToFileAsync({ html });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(file.uri, {
            mimeType: "application/pdf",
            dialogTitle: "Export Client Records PDF",
            UTI: "com.adobe.pdf",
          });
        } else {
          showMessage("PDF Created", file.uri);
        }
      }

      setShowExport(false);
    } catch (error) {
      showMessage("PDF Export Error", error.message || "Unable to export PDF.");
    } finally {
      setExporting(false);
    }
  };

  // =====================================================
  // LOGIN SCREEN
  // =====================================================

  if (!loggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.loginContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.loginLogo}><Text style={styles.loginLogoText}>C</Text></View>
          <Text style={styles.loginBrand}>CLIENTCARE</Text>
          <Text style={styles.loginTitle}>Welcome Back</Text>
          <Text style={styles.loginSubtitle}>Secure client record management</Text>

          <View style={styles.loginCard}>
            <Input label="Phone Number" placeholder="Enter authorized phone number"
              value={loginPhone} onChangeText={setLoginPhone} keyboardType="phone-pad" />
            <Text style={[styles.inputLabel, { marginTop: 8 }]}>Password</Text>
            <View style={styles.passwordBox}>
              <TextInput style={styles.passwordInput} placeholder="Enter password"
                placeholderTextColor={COLORS.textLight} value={loginPassword}
                onChangeText={setLoginPassword} secureTextEntry={!showPassword}
                autoCapitalize="none" />
              <TouchableOpacity style={styles.showButton} onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showButtonText}>{showPassword ? "HIDE" : "SHOW"}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.primaryButton, loginLoading && styles.disabledButton]}
              onPress={handleLogin} disabled={loginLoading}>
              {loginLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign In</Text>}
            </TouchableOpacity>
          </View>
          <Text style={styles.secureText}>🔒 Authorized users only</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =====================================================
  // ADD / EDIT CLIENT SCREEN
  // =====================================================

  if (screen === "add") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <PageHeader title={isEditing ? "Edit Client" : "Add Client"}
            subtitle={isEditing ? "Update existing client information" : "Create a new client record"}
            onBack={() => { resetForm(); setScreen(isEditing ? "details" : "dashboard"); }} />

          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.formCard}>
            <Input label="Client Name" placeholder="Enter client name" value={name} onChangeText={setName} />
            <Input label="Age" placeholder="Enter age" value={age} onChangeText={setAge} keyboardType="numeric" />
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {["Male", "Female", "Other"].map((item) => (
                <TouchableOpacity key={item}
                  style={[styles.genderButton, gender === item && styles.genderButtonActive]}
                  onPress={() => setGender(item)}>
                  <Text style={[styles.genderText, gender === item && styles.genderTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input label="Phone Number" placeholder="Enter phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Input label="Address" placeholder="Enter address" value={address} onChangeText={setAddress} multiline />
            <Input label="Date" placeholder="DD/MM/YYYY" value={clientDate} onChangeText={setClientDate} keyboardType="numeric" />
            <Text style={styles.dateHint}>Example: 21/08/2026</Text>
          </View>

          <Text style={styles.sectionTitle}>Medical Information</Text>
          <View style={styles.formCard}>
            <Input label="PHC / HSC" placeholder="Enter PHC / HSC" value={phc} onChangeText={setPhc} />
            <Input label="Diagnosis" placeholder="Enter diagnosis" value={diagnosis} onChangeText={setDiagnosis} multiline />
            <Input label="Treatment" placeholder="Enter treatment" value={treatment} onChangeText={setTreatment} multiline />
          </View>

          <TouchableOpacity style={[styles.primaryButton, saving && styles.disabledButton]}
            onPress={handleSaveClient} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> :
              <Text style={styles.primaryButtonText}>{isEditing ? "Update Client" : "Save Client"}</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => { resetForm(); setScreen("dashboard"); }}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =====================================================
  // CLIENT DETAILS
  // =====================================================

  if (screen === "details") {
    if (!selectedClient) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Client not selected</Text>
            <TouchableOpacity onPress={() => setScreen("clients")}><Text style={styles.viewAll}>Back to clients</Text></TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <PageHeader title="Client Details" subtitle="Complete client information" onBack={() => setScreen("clients")} />
          <View style={styles.detailCard}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileText}>{String(selectedClient.name || "C").charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.detailName}>{selectedClient.name}</Text>
            <Text style={styles.detailDate}>Record Date: {selectedClient.date || "-"}</Text>
          </View>

          <DetailRow label="Age" value={selectedClient.age} />
          <DetailRow label="Gender" value={selectedClient.gender} />
          <DetailRow label="Phone Number" value={selectedClient.phone || "Not provided"} />
          <DetailRow label="Address" value={selectedClient.address} />
          <DetailRow label="PHC / HSC" value={selectedClient.phc} />
          <DetailRow label="Diagnosis" value={selectedClient.diagnosis} />
          <DetailRow label="Treatment" value={selectedClient.treatment} />

          <TouchableOpacity style={styles.primaryButton} onPress={() => startEditClient(selectedClient)}>
            <Text style={styles.primaryButtonText}>✎  Edit Client Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}
            onPress={() => deleteClient(selectedClient._id || selectedClient.id)}>
            <Text style={styles.deleteButtonText}>Delete Client</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =====================================================
  // CLIENT LIST
  // =====================================================

  if (screen === "clients") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <PageHeader title="All Clients" subtitle={`${clients.length} total records`} onBack={() => setScreen("dashboard")} />
          <TextInput style={styles.searchInput} placeholder="Search name, phone, diagnosis..."
            placeholderTextColor={COLORS.textLight} value={searchText} onChangeText={setSearchText} />
          {filteredClients.length === 0 ? <EmptyBox title="No clients found" text="Try another search." /> :
            filteredClients.map((client) => (
              <ClientListCard key={client._id || client.id} client={client} onPress={() => openClient(client)} />
            ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  const maleCount = clients.filter((client) => client.gender === "Male").length;
  const femaleCount = clients.filter((client) => client.gender === "Female").length;
  const recentClients = clients.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.dashboardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.smallGreeting}>CLIENTCARE</Text>
            <Text style={styles.dashboardTitle}>Client Records</Text>
            <Text style={styles.dashboardSubtitle}>Manage your client information</Text>
          </View>
          <View style={[styles.statusDot, {
            backgroundColor: serverStatus === "online" ? COLORS.success :
              serverStatus === "offline" ? COLORS.danger : "#F59E0B",
          }]} />
        </View>

        <View style={styles.statsRow}>
          <StatCard title="Total" value={clients.length} />
          <StatCard title="Male" value={maleCount} />
          <StatCard title="Female" value={femaleCount} />
        </View>

        <TouchableOpacity style={styles.addCard} onPress={openAddClient} activeOpacity={0.85}>
          <View style={styles.addIcon}><Text style={styles.addIconText}>+</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addTitle}>Add New Client</Text>
            <Text style={styles.addSubtitle}>Create a new client record</Text>
          </View>
          <Text style={styles.addArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exportCard} onPress={() => setShowExport(!showExport)}>
          <View style={styles.exportIcon}><Text style={styles.exportIconText}>↓</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.exportTitle}>Export Files</Text>
            <Text style={styles.exportSubtitle}>Download Excel or PDF by date range</Text>
          </View>
          <Text style={styles.exportArrow}>{showExport ? "⌃" : "›"}</Text>
        </TouchableOpacity>

        {showExport && (
          <View style={styles.exportPanel}>
            <Text style={styles.exportPanelTitle}>Select Date Range</Text>
            <Input label="From Date" placeholder="DD/MM/YYYY" value={fromDate} onChangeText={setFromDate} keyboardType="numeric" />
            <Input label="To Date" placeholder="DD/MM/YYYY" value={toDate} onChangeText={setToDate} keyboardType="numeric" />
            <Text style={styles.dateHint}>Example: 01/03/2026 → 04/04/2026</Text>
            <TouchableOpacity style={[styles.exportButton, exporting && styles.disabledButton]}
              onPress={handleExportExcel} disabled={exporting}>
              {exporting ? <ActivityIndicator color="#fff" /> : <Text style={styles.exportButtonText}>Download Excel (.xlsx)</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.exportButton, styles.pdfButton, exporting && styles.disabledButton]}
              onPress={handleExportPDF} disabled={exporting}>
              {exporting ? <ActivityIndicator color="#fff" /> : <Text style={styles.exportButtonText}>Download PDF (.pdf)</Text>}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Clients</Text>
            <Text style={styles.sectionSubtitle}>Latest registered records</Text>
          </View>
          <TouchableOpacity onPress={() => setScreen("clients")}><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>

        {loading ? <View style={styles.loadingBox}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.loadingText}>Loading clients...</Text></View> :
          recentClients.length === 0 ? <EmptyBox title="No clients yet" text="Add your first client to get started." /> :
            recentClients.map((client) => (
              <ClientListCard key={client._id || client.id} client={client} onPress={() => openClient(client)} />
            ))}

        <TouchableOpacity style={styles.refreshButton} onPress={() => fetchClients()}>
          <Text style={styles.refreshText}>↻ Refresh Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

function Input({ label, placeholder, value, onChangeText, keyboardType, multiline = false }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

function PageHeader({ title, subtitle, onBack }) {
  return (
    <View style={styles.pageHeader}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.pageTitle}>{title}</Text>
        <Text style={styles.pageSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function StatCard({ title, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function ClientListCard({ client, onPress }) {
  return (
    <TouchableOpacity style={styles.clientCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.clientAvatar}>
        <Text style={styles.clientAvatarText}>{String(client.name || "C").charAt(0).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.clientName}>{client.name}</Text>
        <Text style={styles.clientInfo}>{client.age} years • {client.gender}</Text>
        <Text style={styles.clientDate}>{client.date || "-"}</Text>
      </View>
      <Text style={styles.clientArrow}>›</Text>
    </TouchableOpacity>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{String(value ?? "-")}</Text>
    </View>
  );
}

function EmptyBox({ title, text }) {
  return (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyIcon}>👤</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 18, paddingBottom: 50 },

  loginContainer: {
    flexGrow: 1, justifyContent: "center", padding: 22,
    backgroundColor: COLORS.background,
  },
  loginLogo: {
    width: 76, height: 76, borderRadius: 25, backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center", alignSelf: "center", marginBottom: 15,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  loginLogoText: { color: COLORS.white, fontSize: 38, fontWeight: "900" },
  loginBrand: {
    textAlign: "center", color: COLORS.primary, fontSize: 11,
    fontWeight: "900", letterSpacing: 4, marginBottom: 12,
  },
  loginTitle: { textAlign: "center", fontSize: 29, fontWeight: "900", color: COLORS.text },
  loginSubtitle: {
    textAlign: "center", fontSize: 12, color: COLORS.textSecondary,
    marginTop: 6, marginBottom: 28,
  },
  loginCard: {
    backgroundColor: COLORS.surface, borderRadius: 25, padding: 20,
    shadowColor: "#171A2B", shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.08, shadowRadius: 18, elevation: 5,
  },
  passwordBox: {
    flexDirection: "row", alignItems: "center", height: 50,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 14,
    backgroundColor: "#FAFBFE",
  },
  passwordInput: { flex: 1, height: 50, paddingHorizontal: 14, color: COLORS.text, fontSize: 13 },
  showButton: { paddingHorizontal: 14 },
  showButtonText: { color: COLORS.primary, fontSize: 10, fontWeight: "900" },
  secureText: { textAlign: "center", marginTop: 18, color: COLORS.textSecondary, fontSize: 11 },

  dashboardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 24,
  },
  smallGreeting: { fontSize: 10, fontWeight: "800", letterSpacing: 2, color: COLORS.primary, marginBottom: 5 },
  dashboardTitle: { fontSize: 28, fontWeight: "900", color: COLORS.text },
  dashboardSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginTop: 7 },
  pageHeader: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  backButton: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.surface,
    justifyContent: "center", alignItems: "center", marginRight: 12,
    shadowColor: "#171A2B", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  backArrow: { fontSize: 34, color: COLORS.text, marginTop: -4 },
  pageTitle: { fontSize: 24, fontWeight: "900", color: COLORS.text },
  pageSubtitle: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 18, padding: 16,
    shadowColor: "#171A2B", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  statValue: { fontSize: 24, fontWeight: "900", color: COLORS.primary },
  statTitle: { fontSize: 10, fontWeight: "700", color: COLORS.textSecondary, marginTop: 3 },

  addCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primary,
    borderRadius: 22, padding: 18, marginBottom: 12,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2, shadowRadius: 15, elevation: 7,
  },
  addIcon: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center", marginRight: 13,
  },
  addIconText: { color: COLORS.white, fontSize: 28, fontWeight: "300" },
  addTitle: { color: COLORS.white, fontSize: 15, fontWeight: "800" },
  addSubtitle: { color: "#E6E7FF", fontSize: 10, marginTop: 4 },
  addArrow: { color: COLORS.white, fontSize: 28 },

  exportCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface,
    borderRadius: 20, padding: 16, marginBottom: 18,
    shadowColor: "#171A2B", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  exportIcon: {
    width: 46, height: 46, borderRadius: 15, backgroundColor: "#EEF0FF",
    justifyContent: "center", alignItems: "center", marginRight: 13,
  },
  exportIconText: { color: COLORS.primary, fontSize: 25, fontWeight: "900" },
  exportTitle: { fontSize: 14, fontWeight: "900", color: COLORS.text },
  exportSubtitle: { fontSize: 10, color: COLORS.textSecondary, marginTop: 3 },
  exportArrow: { fontSize: 25, color: COLORS.primary },
  exportPanel: {
    backgroundColor: COLORS.surface, borderRadius: 22, padding: 18, marginBottom: 20,
    shadowColor: "#171A2B", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  exportPanelTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text, marginBottom: 15 },
  exportButton: {
    height: 52, borderRadius: 16, backgroundColor: COLORS.success,
    justifyContent: "center", alignItems: "center", marginTop: 10,
  },
  pdfButton: { backgroundColor: COLORS.primary },
  exportButtonText: { color: COLORS.white, fontSize: 13, fontWeight: "900" },

  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 13,
  },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text, marginBottom: 4 },
  sectionSubtitle: { fontSize: 10, color: COLORS.textSecondary },
  viewAll: { color: COLORS.primary, fontSize: 11, fontWeight: "800" },

  clientCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface,
    borderRadius: 19, padding: 15, marginBottom: 10,
    shadowColor: "#171A2B", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  clientAvatar: {
    width: 46, height: 46, borderRadius: 15, backgroundColor: "#EEF0FF",
    justifyContent: "center", alignItems: "center", marginRight: 13,
  },
  clientAvatarText: { color: COLORS.primary, fontSize: 18, fontWeight: "900" },
  clientName: { fontSize: 14, fontWeight: "900", color: COLORS.text },
  clientInfo: { fontSize: 10, color: COLORS.textSecondary, marginTop: 3 },
  clientDate: { fontSize: 9, color: COLORS.primary, fontWeight: "700", marginTop: 4 },
  clientArrow: { fontSize: 25, color: COLORS.textLight },

  formCard: {
    backgroundColor: COLORS.surface, borderRadius: 22, padding: 18, marginBottom: 24,
    shadowColor: "#171A2B", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 11, fontWeight: "800", color: COLORS.text, marginBottom: 7 },
  input: {
    height: 50, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14,
    backgroundColor: "#FAFBFE", paddingHorizontal: 14, color: COLORS.text, fontSize: 13,
  },
  textArea: { height: 90, paddingTop: 14 },
  dateHint: { color: COLORS.textSecondary, fontSize: 10, marginTop: -8, marginBottom: 8 },
  genderRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  genderButton: {
    flex: 1, height: 44, borderRadius: 13, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: "#FAFBFE", justifyContent: "center", alignItems: "center",
  },
  genderButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  genderText: { fontSize: 11, fontWeight: "700", color: COLORS.textSecondary },
  genderTextActive: { color: COLORS.white },

  primaryButton: {
    height: 54, borderRadius: 17, backgroundColor: COLORS.primary,
    justifyContent: "center", alignItems: "center", marginTop: 10, marginBottom: 12,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  primaryButtonText: { color: COLORS.white, fontSize: 14, fontWeight: "900" },
  disabledButton: { opacity: 0.6 },
  cancelButton: {
    height: 50, borderRadius: 17, backgroundColor: COLORS.surface,
    justifyContent: "center", alignItems: "center",
  },
  cancelButtonText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: "800" },

  detailCard: {
    backgroundColor: COLORS.surface, borderRadius: 23, padding: 22,
    alignItems: "center", marginBottom: 15,
    shadowColor: "#171A2B", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  profileCircle: {
    width: 70, height: 70, borderRadius: 24, backgroundColor: "#EEF0FF",
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  profileText: { fontSize: 30, fontWeight: "900", color: COLORS.primary },
  detailName: { fontSize: 21, fontWeight: "900", color: COLORS.text },
  detailDate: { fontSize: 10, color: COLORS.textSecondary, marginTop: 5 },
  detailRow: { backgroundColor: COLORS.surface, borderRadius: 17, padding: 16, marginBottom: 9 },
  detailLabel: {
    fontSize: 9, fontWeight: "800", color: COLORS.textSecondary,
    textTransform: "uppercase", marginBottom: 5,
  },
  detailValue: { fontSize: 13, fontWeight: "700", color: COLORS.text, lineHeight: 20 },
  deleteButton: {
    height: 52, borderRadius: 16, backgroundColor: "#FEE2E2",
    justifyContent: "center", alignItems: "center", marginTop: 4,
  },
  deleteButtonText: { color: COLORS.danger, fontSize: 13, fontWeight: "900" },

  searchInput: {
    height: 50, borderWidth: 1, borderColor: COLORS.border, borderRadius: 15,
    backgroundColor: COLORS.surface, paddingHorizontal: 15, color: COLORS.text,
    fontSize: 13, marginBottom: 15,
  },
  loadingBox: {
    backgroundColor: COLORS.surface, borderRadius: 22, padding: 35, alignItems: "center",
  },
  loadingText: { marginTop: 12, fontSize: 12, color: COLORS.textSecondary },
  emptyBox: {
    backgroundColor: COLORS.surface, borderRadius: 22, padding: 35, alignItems: "center",
  },
  emptyIcon: { fontSize: 38, marginBottom: 10 },
  emptyTitle: { fontSize: 17, fontWeight: "900", color: COLORS.text },
  emptyText: { fontSize: 11, color: COLORS.textSecondary, textAlign: "center", marginTop: 6 },

  refreshButton: {
    height: 48, borderRadius: 15, backgroundColor: COLORS.surface,
    justifyContent: "center", alignItems: "center", marginTop: 18,
  },
  refreshText: { color: COLORS.primary, fontSize: 12, fontWeight: "800" },
  logoutButton: {
    height: 48, borderRadius: 15, backgroundColor: "#FEE2E2",
    justifyContent: "center", alignItems: "center", marginTop: 10,
  },
  logoutText: { color: COLORS.danger, fontSize: 12, fontWeight: "900" },
});
