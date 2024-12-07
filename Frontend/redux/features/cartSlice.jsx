import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../../src/service/cartService";
import * as wishlistService from "../../src/service/wishlistService";

// Async Thunk for adding to cart
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (item, { dispatch, getState, rejectWithValue }) => {
    console.log("addToCartAsync called with item:", item);

    try {
      const currentCart = getState().cart.items;
      console.log("Current cart state:", currentCart);

      const existingCartItem = currentCart.find(
        (cartItem) => cartItem._id === item._id
      );
      const quantity = existingCartItem ? existingCartItem.quantity + 1 : 1;
      const totalPrice = item.price * quantity;

      const cartItem = {
        ...item,
        quantity,
        totalPrice,
      };

      console.log("Prepared cart item:", cartItem);

      // Call backend service
     const response = await cartService.addToCart({
        productId: item._id,
        quantity,
        price: item.price,
      });
      console.log("Cart item sent to backend",response.addedItem);
       dispatch(cartSlice.actions.addToCart(response.addedItem));
      console.log("Dispatched addToCart action to Redux store");

      return cartItem;
    } catch (error) {
      console.error("Error in addToCartAsync:", error);
      dispatch(cartSlice.actions.removeFromCart(item._id));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for removing from cart
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    console.log("removeFromCartAsync called with productId:", productId);

    try {
      const currentState = getState().cart;
      const removedItem = currentState.items.find(
        (item) => item._id === productId
      );

      dispatch(cartSlice.actions.removeFromCart(productId));
      console.log("Dispatched removeFromCart action to Redux store");

      await cartService.removeFromCart(productId);
      console.log("Cart item removed from backend");

      return productId;
    } catch (error) {
      console.error("Error in removeFromCartAsync:", error);

      if (removedItem) {
        dispatch(cartSlice.actions.addToCart(removedItem));
        console.log("Reverted removeFromCart action in Redux store");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for adding to wishlist
export const addToWishlistAsync = createAsyncThunk(
  "cart/addToWishlist",
  async (item, { dispatch, rejectWithValue }) => {
    console.log("addToWishlistAsync called with item:", item);

    try {
      dispatch(cartSlice.actions.addItemToWishlist(item));
      console.log("Dispatched addItemToWishlist action to Redux store");

      await wishlistService.addToWishlist(item);
      console.log("Wishlist item added to backend");

      return item;
    } catch (error) {
      console.error("Error in addToWishlistAsync:", error);

      dispatch(cartSlice.actions.removeItemFromWishlist(item));
      console.log("Reverted addItemToWishlist action in Redux store");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for removing from wishlist
export const removeFromWishlistAsync = createAsyncThunk(
  "cart/removeFromWishlist",
  async (item, { dispatch, rejectWithValue }) => {
    console.log("removeFromWishlistAsync called with item:", item);

    try {
      dispatch(cartSlice.actions.removeItemFromWishlist(item));
      console.log("Dispatched removeItemFromWishlist action to Redux store");

      await wishlistService.removeFromWishlist(item._id);
      console.log("Wishlist item removed from backend");

      return item;
    } catch (error) {
      console.error("Error in removeFromWishlistAsync:", error);

      dispatch(cartSlice.actions.addItemToWishlist(item));
      console.log("Reverted removeItemFromWishlist action in Redux store");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk to fetch initial cart data
export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async (_, { dispatch }) => {
    console.log("fetchCartAsync called");

    try {
      const cartData = await cartService.getCart();
      console.log("Fetched cart data from backend:", cartData);

      dispatch(cartSlice.actions.clearCart());
      console.log("Cleared current cart in Redux store");

      cartData.forEach((item) => {
        const quantity = item.quantity || 1;
        const totalPrice = item.price * quantity;

        dispatch(
          cartSlice.actions.addToCart({
            ...item,
            quantity,
            totalPrice,
          })
        );
        console.log("Added item to Redux store:", item);
      });

      return cartData;
    } catch (error) {
      console.error("Error in fetchCartAsync:", error);
      return [];
    }
  }
);

// Async Thunk to fetch wishlist
export const fetchWishlistAsync = createAsyncThunk(
  "cart/fetchWishlist",
  async (_, { dispatch }) => {
    console.log("fetchWishlistAsync called");

    try {
      const wishlistData = await wishlistService.getWishlist();
      console.log("Fetched wishlist data from backend:", wishlistData);

      dispatch(cartSlice.actions.clearWishlist());
      console.log("Cleared current wishlist in Redux store");

      wishlistData.forEach((item) => {
        dispatch(cartSlice.actions.addItemToWishlist(item));
        console.log("Added item to wishlist in Redux store:", item);
      });

      return wishlistData;
    } catch (error) {
      console.error("Error in fetchWishlistAsync:", error);
      return [];
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    wishlist: [],
    status: {
      cart: "idle",
      wishlist: "idle",
    },
    error: {
      cart: null,
      wishlist: null,
    },
  },
  reducers: {
    addToCart: (state, action) => {
      console.log("addToCart reducer called with:", action.payload);

      const existingItemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += 1;
        state.items[existingItemIndex].totalPrice =
          state.items[existingItemIndex].price *
          state.items[existingItemIndex].quantity;
      } else {
        const totalPrice = action.payload.price * 1;

        state.items.push({
          ...action.payload,
          quantity: 1,
          totalPrice,
        });
      }
    },
    removeFromCart: (state, action) => {
      console.log("removeFromCart reducer called with:", action.payload);
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearCart: (state) => {
      console.log("clearCart reducer called");
      state.items = [];
    },
    clearWishlist: (state) => {
      console.log("clearWishlist reducer called");
      state.wishlist = [];
    },
    addItemToWishlist: (state, action) => {
      console.log("addItemToWishlist reducer called with:", action.payload);

      const existingItem = state.wishlist.find(
        (item) => item._id === action.payload._id
      );

      if (!existingItem) {
        state.wishlist.push(action.payload);
      }
    },
    removeItemFromWishlist: (state, action) => {
      console.log("removeItemFromWishlist reducer called with:", action.payload);
      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload._id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        console.log("fetchCartAsync pending");
        state.status.cart = "loading";
      })
      .addCase(fetchCartAsync.fulfilled, (state) => {
        console.log("fetchCartAsync fulfilled");
        state.status.cart = "succeeded";
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        console.log("fetchCartAsync rejected with error:", action.error.message);
        state.status.cart = "failed";
        state.error.cart = action.error.message;
      })
      .addCase(fetchWishlistAsync.pending, (state) => {
        console.log("fetchWishlistAsync pending");
        state.status.wishlist = "loading";
      })
      .addCase(fetchWishlistAsync.fulfilled, (state) => {
        console.log("fetchWishlistAsync fulfilled");
        state.status.wishlist = "succeeded";
      })
      .addCase(fetchWishlistAsync.rejected, (state, action) => {
        console.log(
          "fetchWishlistAsync rejected with error:",
          action.error.message
        );
        state.status.wishlist = "failed";
        state.error.wishlist = action.error.message;
      });
  },
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  clearCart,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
} = cartSlice.actions;

export default cartSlice.reducer;
