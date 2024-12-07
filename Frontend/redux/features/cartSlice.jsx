import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../../src/service/cartService";
import * as wishlistService from "../../src/service/wishlistService"; // Assuming you have a similar service for wishlist

// Async Thunk for adding to cart
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (item, { dispatch, rejectWithValue }) => {
    try {
      // First, update local Redux state
      dispatch(cartSlice.actions.addToCart(item));
      
      // Then call backend service
      await cartService.addToCart(item);
      
      return item;
    } catch (error) {
      // Revert local state if backend fails
      dispatch(cartSlice.actions.removeFromCart(item._id));
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for removing from cart
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      // First, find the item to potentially restore if backend fails
      const currentState = store.getState().cart;
      const removedItem = currentState.items.find(item => item._id === productId);
      
      // Update local Redux state
      dispatch(cartSlice.actions.removeFromCart(productId));
      
      // Call backend service
      await cartService.removeFromCart(productId);
      
      return productId;
    } catch (error) {
      // Revert local state if backend fails
      if (removedItem) {
        dispatch(cartSlice.actions.addToCart(removedItem));
      }
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for adding to wishlist
export const addToWishlistAsync = createAsyncThunk(
  "cart/addToWishlist",
  async (item, { dispatch, rejectWithValue }) => {
    console.log('item in add to wishlist ', item)
    try {
      // First, update local Redux state
      dispatch(cartSlice.actions.AddItemtoWishlist(item));
      
      // Then call backend service
      await wishlistService.addToWishlist(item);
      
      return item;
    } catch (error) {
      // Revert local state if backend fails
      dispatch(cartSlice.actions.removeItemFromWishlist(item));
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for removing from wishlist
export const removeFromWishlistAsync = createAsyncThunk(
  "cart/removeFromWishlist",
  async (item, { dispatch, rejectWithValue }) => {
    try {
      // Update local Redux state
      dispatch(cartSlice.actions.removeItemFromWishlist(item));
      
      // Call backend service
      await wishlistService.removeFromWishlist(item._id);
      
      return item;
    } catch (error) {
      // Revert local state if backend fails
      dispatch(cartSlice.actions.AddItemtoWishlist(item));
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk to fetch initial cart data
export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async (_, { dispatch }) => {
    try {
      const cartData = await cartService.getCart();
      console.log('cartData', cartData)
      // Clear existing cart and add fetched items
      dispatch(cartSlice.actions.clearCart());
      cartData.forEach(item => {
        dispatch(cartSlice.actions.addToCart(item));
      });
      
      return cartData;
    } catch (error) {
      console.error("Failed to fetch cart", error);
      return [];
    }
  }
);
export const fetchWishlistAsync = createAsyncThunk(
  "cart/fetchWishlist",
  async (_, { dispatch }) => {
    try {
      const wishlistData = await wishlistService.getWishlist();
      
      // Clear existing wishlist and add fetched items
      dispatch(cartSlice.actions.clearWishlist());
      wishlistData.forEach(item => {
        dispatch(cartSlice.actions.AddItemtoWishlist(item));
      });
      
      return wishlistData;
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
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
      cart: 'idle',
      wishlist: 'idle'
    },
    error: {
      cart: null,
      wishlist: null
    }
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    incrament: (state, action) => {
      const ItemIndex_inc = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (ItemIndex_inc >= 0) {
        state.items[ItemIndex_inc].quantity += 1; // Properly updating quantity
      }
    },
    decrement: (state, action) => {
      const ItemIndex_dec = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (ItemIndex_dec >= 0) {
        if (state.items[ItemIndex_dec].quantity > 1) {
          state.items[ItemIndex_dec].quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item._id !== action.payload._id
          );
        }
      }
    },

    clearCart: (state) => {
      state.items = []; // Ensure this exists
    },
    clearWishlist: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.status.cart = 'loading';
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.status.cart = 'succeeded';
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.status.cart = 'failed';
        state.error.cart = action.error.message;
      })
      .addCase(fetchWishlistAsync.pending, (state) => {
        state.status.wishlist = 'loading';
      })
      .addCase(fetchWishlistAsync.fulfilled, (state, action) => {
        state.status.wishlist = 'succeeded';
      })
      .addCase(fetchWishlistAsync.rejected, (state, action) => {
        state.status.wishlist = 'failed';
        state.error.wishlist = action.error.message;
      });
  }
});


// Update exports to include clearWishlist
export const {
  addToCart,
  removeFromCart,
  incrament,
  decrement,
  clearCart,
  AddItemtoWishlist,
  removeItemFromWishlist,
  clearWishlist, // New export
} = cartSlice.actions;

export default cartSlice.reducer;