import { StyleSheet, Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  scrollView: {
    backgroundColor: "#F5F5F5",
  },
  carouselContainer: {
    position: "relative",
    height: 400,
  },
  carouselOverlay: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 25,
    padding: 8,
  },
  heartIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
  },
  carouselImageContainer: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 400,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 12,
    height: 12,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: "#F5F5F5",
  },
  storeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productInfoContainer: {
    marginBottom: 20,
  },
  productTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    flex: 0.7,
  },
  stockStatus: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    marginRight: 10,
    fontSize: 14,
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  tabContentContainer: {
    padding: 15,
  },
  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 15,
  },
  highlightsContainer: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  highlightKey: {
    fontWeight: "600",
    marginRight: 10,
    color: "#666",
  },
  highlightValue: {
    color: "#333",
  },
  tagsContainer: {
    marginBottom: 15,
  },
  tagChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#E0E0E0",
  },
  reviewsContainer: {
    padding: 15,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  seeAllButton: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  ratingsText: {
    color: "#666",
  },
  cartSection: {
    backgroundColor: "#fff",
    padding: 15,
    elevation: 10,
  },
});
