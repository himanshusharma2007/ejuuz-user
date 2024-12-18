import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainerStyle: {
    // backgroundColor: "#F8F9FA",
    // flex: 1
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    height: 150,
    backgroundColor: "white",
    // borderWidth: 0.3, // Border width
    // borderColor: "gray", // Border color
    borderRadius: 10, // Border radius
    overflow: "hidden", // Ensures content is clipped to border radius
    // paddingVertical: 20,
    paddingTop: 20,
    // paddingBottom: 0,
  },
  CategorycontentContainerStyle: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  CategoryloadingContainer: {
    height: 60,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  PopularcontentContainerStyle: {
    flexDirection: "row", // Arrange loaders in a row
    flexWrap: "wrap", // Allow wrapping to the next line if space is insufficient
    justifyContent: "space-between", // Add space between loaders
    alignItems: "flex-start", // Align loaders to the top
    paddingHorizontal: 10, // Add horizontal padding
  },

  PopularloadingContainer: {
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row", // Ensure items align in a row
    gap: 10,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 90 : 70,
  },
  curve: {
    width: "100%",
    height: 350,
    backgroundColor: "#002E6E",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    paddingTop: Platform.OS === "ios" ? 20 : 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 60,
  },
  logo: {
    width: 180,
    height: 200,
    marginTop: 50,
    marginBottom: -25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  headerIcons: {
    flexDirection: "row",
    marginLeft: 12,
  },
  iconButton: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    padding: 3,
    borderRadius: 50,
    width: 16,
    height: 16,
    textAlign: "center",
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "red",
    color: "white",
    fontSize: 10,
  },
  locationBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  locationText: {
    flex: 1,
    marginHorizontal: 8,
    color: "#FFF",
    fontSize: 14,
  },
  bannerContainer: {
    width: width - 32,
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bannerContent: {
    flexDirection: "row",
    padding: 16,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  discountText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  discountAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4361EE",
    marginBottom: 12,
  },
  seeDetailButton: {
    backgroundColor: "#4361EE",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  seeDetailButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  bannerImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  bannerDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#4361EE",
    marginHorizontal: 4,
  },
  categoriesSection: {
    padding: 8,
    backgroundColor: "#F8F9FA",
    marginTop: 45,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#4361EE",
    fontSize: 14,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 6,
  },
  categoryItem: {
    width: 90,
    height: 30,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 8,
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  storesSection: {
    // padding: 16,
    paddingVertical: 16,
  },
  storesScrollContent: {
    paddingHorizontal: 8,
  },
  categoryScrollContent: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
  },
  storeCard: {
    width: width * 0.6,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: "#FFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  storeInfo: {
    padding: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  storeRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  recommendedSection: {
    marginTop: 20,
    // paddingHorizontal: 15,
  },
  recommendedScrollContent: {
    paddingVertical: 10,
    paddingLeft: 15,
  },
  recommendedCard: {
    width: 160,
    marginRight: 15,
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
  recommendedImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recommendedInfo: {
    padding: 10,
  },
  recommendedName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
    marginRight: 6,
  },
  oldPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },

  // Weekly Deals Section
  dealsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  dealsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dealCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dealInfo: {
    padding: 10,
  },
  dealName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  dealPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dealPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
    marginRight: 6,
  },
  dealOldPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  dealBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveAmount: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  validUntil: {
    fontSize: 12,
    color: "#666",
  },

  // Recently Viewed Section
  recentlyViewedSection: {
    marginTop: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  recentlyViewedContent: {
    paddingVertical: 10,
  },
  recentlyViewedItem: {
    width: 80,
    marginRight: 15,
    alignItems: "center",
  },
  recentlyViewedImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
  },
  recentlyViewedName: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
});
