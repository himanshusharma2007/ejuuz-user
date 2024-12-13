import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    wishlist: [],
  },
  reducers: {
    addToCart: (state, action) => {
      // Create a deep copy of the payload to ensure we're working with a new object
      const newItem = JSON.parse(JSON.stringify(action.payload));
      
      console.log('New Item Being Added:', newItem);
      console.log('Current Cart Items:', state.items);
    
      // Find the index of an existing item with the same id
        const existingItemIndex = state.items.findIndex(
          (item) => {
            // Use _id instead of id
            console.log('Comparing:', item._id, 'with', newItem._id);
            return item._id === newItem._id;
          }
        );
    
      // If the item exists, increment its quantity
      if (existingItemIndex !== -1) {
        console.log('Existing item found at index:', existingItemIndex);
        state.items[existingItemIndex].quantity += 1;
      } else {
        // If the item does not exist, add it to the cart with quantity 1
        console.log('Adding new item to cart');
        const itemToAdd = {
          ...newItem,
          quantity: 1,
          // Add a unique identifier 
          cartItemId: Date.now() + Math.random()
        };
        state.items.push(itemToAdd);
      }
    
      console.log('Updated Cart Items:', state.items);
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
