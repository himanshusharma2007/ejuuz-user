import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
    marginTop: -20,
  },
  carouselContainer: {
    position: "relative",
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    width: "100%",
    padding: 16,
    zIndex: 1,
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#707070",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  hearticon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  carouselImage: {
    width: width,
    height: 300,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 26,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D8D8D8",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#4CAF50",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  storeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  storeName: {
    fontSize: 16,
    color: "#4CAF50",
  },
  distanceChip: {
    backgroundColor: "#E8F5E9",
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  perKg: {
    fontSize: 16,
    color: "#666",
  },
  originalPrice: {
    fontSize: 16,
    color: "#666",
    textDecorationLine: "line-through",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginTop: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  description: {
    padding: 16,
    color: "#666",
    lineHeight: 22,
  },
  nutritionContainer: {
    padding: 16,
  },
  nutritionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  nutritionLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  nutritionValue: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  vitaminsContainer: {
    marginTop: 16,
  },
  vitaminsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  vitaminChip: {
    margin: 4,
    backgroundColor: "#E8F5E9",
  },
  // Reviews Section Styles
  reviewsSection: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllButton: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  reviewItem: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewUserInfo: {
    marginLeft: 12,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  // Recommended Products Section Styles
  recommendedSection: {
    padding: 16,
    backgroundColor: "#fff",
  },
  recommendedProductCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: "#fff",
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
  recommendedProductImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recommendedProductInfo: {
    padding: 12,
  },
  recommendedProductName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recommendedProductPrice: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  // Cart Section Styles
  cartSection: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 5,
    borderTopWidth: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopColor: "#E0E0E0",
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#002E6E",
  },
});
