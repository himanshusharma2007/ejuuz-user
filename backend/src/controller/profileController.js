const { uploadOnCloudinary, deleteOnCloudinary } = require("../../utils/cloudinary");
const emptyTempFolder = require("../../utils/emptyTempFolder");
const Customer = require("../model/customerModel");
const cloudinary = require("cloudinary").v2;

const profileController = {
  // Update profile information
  updateProfile: async (req, res) => {
    try {
      console.log("update profile called", req.body);
      const customerId = req.user._id; // Assuming you have authentication middleware
      const { name, email, address } = req.body;

      // Find the customer and update their profile
      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        {
          $set: {
            name: name || undefined,
            email: email || undefined,
            address: address || undefined,
          },
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Run mongoose validations
        }
      );

      if (!updatedCustomer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          name: updatedCustomer.name,
          email: updatedCustomer.email,
          address: updatedCustomer.address,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Profile update failed",
        error: error.message,
      });
    }
  },

  // Update profile image
  updateProfileImage: async (req, res) => {
    try {
      const customerId = req.user._id;

      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No profile image uploaded",
        });
      }

      // Find the current customer
      const customer = await Customer.findById(customerId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      // If an existing profile image exists, delete it from cloudinary
      if (customer.profile && customer.profile.publicId) {
        try {
          await deleteOnCloudinary(customer.profile.publicId);
        } catch (cloudinaryError) {
          console.warn(
            "Failed to delete previous profile image",
            cloudinaryError
          );
        }
      }

      // Upload new image to cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResponse) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
        });
      }

      // Update customer with new profile image details
      const updatedCustomer = await Customer.findByIdAndUpdate(
        customerId,
        {
          $set: {
            "profile.url": cloudinaryResponse.secure_url,
            "profile.publicId": cloudinaryResponse.public_id,
          },
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Profile image updated successfully",
        data: {
          profileImageUrl: cloudinaryResponse.secure_url,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Profile image update failed",
        error: error.message,
      });
    }finally {
        emptyTempFolder();
    }
  },

  // Get profile details
  getProfile: async (req, res) => {
    try {
        console.log('get profile called req.body', req.body)
      const customerId = req.user._id;

      const customer = await Customer.findById(customerId)
        .select("-password -__v") // Exclude password and version key
        .populate("orderHistory", "orderNumber totalAmount")
        .populate("wishlist", "name price");

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          name: customer.name,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          profileImage: customer.profile,
          walletBalance: customer.walletBalance,
          loyaltyPoints: customer.loyaltyPoints,
          orderHistory: customer.orderHistory,
          wishlist: customer.wishlist,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to retrieve profile",
        error: error.message,
      });
    }
  },
};

module.exports = profileController;
