const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide admin name"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    loginId: {
      type: String,
      required: [true, "Please provide login ID"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please provide admin email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["Super Admin", "Moderator"],
      default: "Moderator",
    },
    resetPasswordOTP: {
      type: String,
      select: false
    },
    resetPasswordOTPExpires: {
      type: Date,
      select: false
    },
    permissions: [
      {
        type: String,
        enum: [
          "manage_admins",
          "manage_merchants",
          "manage_customers",
          "manage_products",
          "manage_orders",
          "manage_transactions",
          "manage_reports",
        ],
      },
    ],
    verificationRequests: [
      {
        merchantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Merchant",
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    systemReports: [
      {
        type: {
          type: String,
          required: true,
        },
        generatedAt: {
          type: Date,
          default: Date.now,
        },
        reportData: Object,
      },
    ],
    transactionsLog: [
      {
        transactionType: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notifications: [
      {
        message: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    platformSettings: {
      commissionRate: {
        type: Number,
        default: 0.1,
      },
      maxWalletLimit: {
        type: Number,
        default: 10000,
      },
      minPayoutAmount: {
        type: Number,
        default: 100,
      },
      currency: {
        type: String,
        default: "ZAR",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
adminSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

adminSchema.methods.generateResetPasswordOTP = function() {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set OTP and expiration (valid for 15 minutes)
  this.resetPasswordOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  this.resetPasswordOTPExpires = Date.now() + 15 * 60 * 1000;
  
  return otp;
};

// Method to verify OTP
adminSchema.methods.verifyResetPasswordOTP = function(candidateOTP) {
  // Check if OTP is expired
  if (this.resetPasswordOTPExpires < Date.now()) {
    return false;
  }

  // Hash the candidate OTP and compare
  const hashedOTP = crypto
    .createHash('sha256')
    .update(candidateOTP)
    .digest('hex');
  
  return hashedOTP === this.resetPasswordOTP;
};

// Password strength validation method
adminSchema.methods.validatePassword = function(password) {
  // Password requirements:
  // - At least 8 characters long
  // - Contains at least one uppercase letter
  // - Contains at least one lowercase letter
  // - Contains at least one number
  // - Contains at least one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  
  return passwordRegex.test(password);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;