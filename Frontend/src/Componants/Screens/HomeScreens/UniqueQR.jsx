import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Feather from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function UniqueQR() {
  const orderData = useSelector((state) => state.cart.items);
  const [downloading, setDownloading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const route = useRoute();
  const { orderItemwithQr } = route.params;
  const qrRef = useRef();
  const navigation = useNavigation();

  const totalAmount = parseFloat(orderItemwithQr) || 0;
  const orderDetails = {
    orderId: orderId,
    status: "Paid",
    total: `R ${totalAmount.toFixed(2)}`,
  };

  useEffect(() => {
    if (orderData.length > 0) {
      setOrderId(orderData[0].id); // Set the first order ID
    }
  }, [orderData]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Order QR Code - Order ID: ${orderDetails.orderId}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDownload = async () => {
    if (!qrRef.current) {
      Alert.alert("Error", "QR code is not ready to download.");
      return;
    }

    try {
      setDownloading(true);
      // Generate QR code as a base64 string
      const svg = await qrRef.current.toDataURL();
      const fileUri = FileSystem.cacheDirectory + `${orderId}-QRCode.png`;

      // Convert base64 to binary and save the image locally
      await FileSystem.writeAsStringAsync(fileUri, svg, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Request permission and save to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Media library permission is required to save the QR code."
        );
        setDownloading(false);
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      Alert.alert("Success", "QR Code saved to your gallery!");
    } catch (error) {
      console.error("Error saving QR Code:", error);
      Alert.alert("Error", "Failed to save QR Code.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Download Icon */}
      <View style={styles.headerContainer}>
        <Ionicons
          onPress={() => navigation.navigate("Cart")}
          name="arrow-back"
          size={24}
          color="#000"
        />
      </View>

      {/* QR Code Section */}
      <View style={styles.qrContainer}>
        <View style={styles.qrWrapper}>
          {orderId ? (
            <QRCode
              value={orderId.toString()} // Generate QR code with orderId
              size={240}
              getRef={(ref) => (qrRef.current = ref)}
            />
          ) : (
            <Text>Loading QR Code...</Text>
          )}
        </View>
        <Text style={styles.scanText}>Scan to Collect the Order</Text>
      </View>

      {/* Order Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Order Details</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Order Id</Text>
            <Text style={styles.value}>{orderDetails.orderId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Payment Status</Text>
            <Text style={[styles.value, styles.statusPaid]}>
              {orderDetails.status}
            </Text>
          </View>

          <View style={[styles.detailRow, styles.noBorder]}>
            <Text style={styles.label}>Order Total</Text>
            <Text style={styles.value}>{orderDetails.total}</Text>
          </View>
        </View>
      </View>

      {/* Download and Share Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
        >
          <Icon name="file-download" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {downloading ? "Downloading..." : "Download QR Code"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Icon name="share" size={20} color="#fff" />
          <Text style={styles.buttonText}>Share QR Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanText: {
    fontSize: 14,
    color: "#666666",
    marginTop: 16,
    fontWeight: "500",
  },
  detailsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 14,
    color: "#666666",
  },
  value: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  statusPaid: {
    color: "#00C853",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  downloadButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
  },
  shareButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#002E6E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
