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
      console.log("Cart item sent to backend",response.updatedCart);
       dispatch(cartSlice.actions.addToCart(response.updatedCart));
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
  async (item, { dispatch, getState, rejectWithValue }) => {
    console.log("addToWishlistAsync called with item:", item);

    try {
      // Check if item is already in wishlist
      const currentWishlist = getState().cart.wishlist;
      const existingItem = currentWishlist.find(
        (wishlistItem) => wishlistItem._id === item._id
      );

      if (existingItem) {
        // Item already in wishlist, return early
        return null;
      }

      // Dispatch action to add to local wishlist state
      dispatch(cartSlice.actions.addItemToWishlist(item));

      // Call backend service to add to wishlist
      await wishlistService.addToWishlist(item);
      
      console.log("Wishlist item added successfully");
      return item;
    } catch (error) {
      console.error("Error in addToWishlistAsync:", error);

      // Revert local state if backend call fails
      dispatch(cartSlice.actions.removeItemFromWishlist(item));
      
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to add to wishlist",
        item
      });
    }
  }
);

// Enhanced Async Thunk for removing from wishlist
export const removeFromWishlistAsync = createAsyncThunk(
  "cart/removeFromWishlist",
  async (item, { dispatch, rejectWithValue }) => {
    console.log("removeFromWishlistAsync called with item:", item);

    try {
      // Dispatch action to remove from local wishlist state
      dispatch(cartSlice.actions.removeItemFromWishlist(item));

      // Call backend service to remove from wishlist
      await wishlistService.removeFromWishlist(item._id);
      
      console.log("Wishlist item removed successfully");
      return item;
    } catch (error) {
      console.error("Error in removeFromWishlistAsync:", error);

      // Revert local state if backend call fails
      dispatch(cartSlice.actions.addItemToWishlist(item));
      
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to remove from wishlist",
        item
      });
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
      dispatch(
        cartSlice.actions.addToCart(cartData)
      );
      console.log("Added cart data to Redux store");

      return cartData;
    } catch (error) {
      console.error("Error in fetchCartAsync:", error);
      return [];
    }
  }
);

// Async Thunk to fetch wisrhlist
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
export const incrementCartItemAsync = createAsyncThunk(
  "cart/incrementCartItem",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    console.log("incrementCartItemAsync called with productId:", productId);

    try {
      const response = await cartService.incrementCartItem(productId);
      console.log("Cart item incremented in backend:", response.updatedCart);

      dispatch(cartSlice.actions.addToCart(response.updatedCart));
      console.log("Dispatched addToCart action to Redux store");

      return response.updatedCart;
    } catch (error) {
      console.error("Error in incrementCartItemAsync:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for decrementing cart item
export const decrementCartItemAsync = createAsyncThunk(
  "cart/decrementCartItem",
  async (productId, { dispatch, getState, rejectWithValue }) => {
    console.log("decrementCartItemAsync called with productId:", productId);

    try {
      const response = await cartService.decrementCartItem(productId);
      console.log("Cart item decremented in backend:", response.updatedCart);

      dispatch(cartSlice.actions.addToCart(response.updatedCart));
      console.log("Dispatched addToCart action to Redux store");

      return response.updatedCart;
    } catch (error) {
      console.error("Error in decrementCartItemAsync:", error);
      return rejectWithValue(error.response?.data || error.message);
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
    
      // Replace the entire cart with the new payload
      state.items = action.payload.map((item) => ({
        ...item,
        quantity: item.quantity || 1, // Ensure quantity is set
        totalPrice: item.price * (item.quantity || 1), // Calculate total price
      }));
    
      console.log("Cart updated successfully with new items:", state.items);
    },
    
    removeFromCart: (state, action) => {
      console.log("removeFromCart reducer called with:", action.payload);
      state.items = state.items.filter((item) => item.productId._id !== action.payload);
    },
    incrament: (state, action) => {
      const ItemIndex_inc = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (ItemIndex_inc >= 0) {
        state.items[ItemIndex_inc].quantity += 1; // Properly updating quantity
      }
    },
    decrement: (state, action) => {
      const ItemIndex_dec = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      // if (ItemIndex_dec >= 0 && state.items[ItemIndex_dec].quantity > 1) {
      //   state.items[ItemIndex_dec].quantity -= 1; // Properly updating quantity
      // }

      if (ItemIndex_dec >= 0) {
        if (state.items[ItemIndex_dec].quantity > 1) {
          state.items[ItemIndex_dec].quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.id !== action.payload.id
          );
        }
      }
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
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.status.wishlist = "failed";
        state.error.wishlist = action.payload?.message || "Failed to add to wishlist";
      })
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.status.wishlist = "loading";
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.status.wishlist = "succeeded";
        // Optional: Additional logic if needed
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.status.wishlist = "failed";
        state.error.wishlist = action.payload?.message || "Failed to remove from wishlist";
      });
  },
});

// Export actions
export const {
  addToCart,
  increment,
  decrement,
  removeFromCart,
  clearCart,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
} = cartSlice.actions;

export default cartSlice.reducer;
