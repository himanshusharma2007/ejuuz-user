import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    wishlist: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const ItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (ItemIndex >= 0) {
        state.items[ItemIndex].quantity += 1;
      } else {
        const temp = { ...action.payload, quantity: 1 };
        state.items.push(temp);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
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
      state.items = [];
    },

    AddItemtoWishlist: (state, action) => {
      // Check if item is already in the wishlist
      const isAlreadyInWishlist = state.wishlist.some(
        (item) => item.id === action.payload.id
      );

      if (!isAlreadyInWishlist) {
        // If not in the wishlist, add the item
        state.wishlist = [...state.wishlist, action.payload];
      }
    },
    removeItemFromWishlist: (state, action) => {
      // Filter out the item with the matching ID
      state.wishlist = state.wishlist.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrament,
  decrement,
  clearCart,
  AddItemtoWishlist,
  removeItemFromWishlist,
} = cartSlice.actions;

export default cartSlice.reducer;
