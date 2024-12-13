const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../../utils/cryptoFunc');

const transactionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  merchantDetails: [
    {
      merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: [true, 'Merchant ID is required']
      },
      amount: {
        type: Number,
        required: [true, 'Transaction amount is required'],
        min: [0, 'Transaction amount cannot be negative']
      },
      merchantWalletSnapshot: {
        type: String,
        required: [true, 'Merchant wallet snapshot is required']
      }
    }
  ],
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  customerWalletSnapshot: {
    type: String,
    required: [true, 'Customer wallet snapshot is required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total transaction amount is required'],
    min: [0, 'Total transaction amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  transactionType: {
    type: String,
    enum: ['ORDER_PAYMENT'],
    required: true
  }
}, { 
  timestamps: true 
});

// Middleware to encrypt wallet snapshots before saving
transactionSchema.pre('save', function(next) {
  if (this.isModified('customerWalletSnapshot') || 
      this.isModified('merchantDetails')) {
    // Encrypt customer wallet snapshot
    this.customerWalletSnapshot = encrypt(this.customerWalletSnapshot.toString());
    
    // Encrypt merchant wallet snapshots
    this.merchantDetails.forEach(detail => {
      detail.merchantWalletSnapshot = encrypt(detail.merchantWalletSnapshot.toString());
    });
  }
  next();
});

// Method to decrypt wallet snapshots
transactionSchema.methods.decryptWalletSnapshots = function() {
  const decryptedData = {
    customerWalletSnapshot: parseFloat(decrypt(this.customerWalletSnapshot)),
    merchantDetails: this.merchantDetails.map(detail => ({
      merchantId: detail.merchantId,
      amount: detail.amount,
      merchantWalletSnapshot: parseFloat(decrypt(detail.merchantWalletSnapshot))
    }))
  };
  return decryptedData;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;