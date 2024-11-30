import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Alert,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const initialNotifications = [
  {
    id: "1",
    type: "Transfer",
    icon: "swap-horizontal-outline",
    description: "You have transferred an amount $876 to Jasson Sterek",
    time: "2024-03-18T10:30:00",
    color: "#FFEBEE",
    isRead: false,
  },
  {
    id: "2",
    type: "Top Up",
    icon: "wallet-outline",
    description: "You have top up an amount $20 to Shoppe Pay",
    time: "2024-03-18T09:15:00",
    color: "#E3F2FD",
    isRead: false,
  },
  {
    id: "3",
    type: "Shopping",
    icon: "cart-outline",
    description: "You shop for shoes on Gemolis.com",
    time: "2024-03-17T14:20:00",
    color: "#FFF3E0",
    isRead: true,
  },
  // ... (rest of your notifications)
];

const NotificationItem = ({ item, onPress, onDelete }) => {
  const [position] = useState(new Animated.Value(0));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        // Only allow left swipe
        position.setValue(Math.max(-75, gestureState.dx));
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        // If swiped more than 50px left
        Animated.timing(position, {
          toValue: -75,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const animatedStyle = {
    transform: [{ translateX: position }],
  };

  return (
    <View style={styles.notificationContainer}>
      <TouchableOpacity
        style={[styles.deleteButton]}
        onPress={() => {
          Animated.timing(position, {
            toValue: -400,
            duration: 300,
            useNativeDriver: false,
          }).start(() => onDelete(item.id));
        }}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Animated.View {...panResponder.panHandlers} style={[animatedStyle]}>
        <TouchableOpacity
          onPress={() => onPress(item)}
          style={[
            styles.notificationCard,
            !item.isRead && styles.unreadNotification,
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={24} color="#4361EE" />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.type}</Text>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.timeText}>{getRelativeTime(item.time)}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Format relative time
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const diffHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffHours < 48) return "Yesterday";
  return notificationDate.toLocaleDateString();
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleNotificationPress = (notification) => {
    if (!notification.isRead) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item
        )
      );
    }
    Alert.alert("Opening", `Navigate to ${notification.type} details`);
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== notificationId)
    );
  };

  const renderHeader = () => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            onPress={handleNotificationPress}
            onDelete={deleteNotification}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  unreadBadge: {
    backgroundColor: "#4361EE",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 70,
  },
  notificationContainer: {
    position: "relative",
    marginVertical: 8,
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 75,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: "#F8F9FE",
    borderLeftWidth: 3,
    borderLeftColor: "#4361EE",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4361EE",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
});
