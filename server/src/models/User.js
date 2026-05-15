const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      firstName: {
        type: String,
      },

      lastName: {
        type: String,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      department: {
        type: String,
      },

      designation: {
        type: String,
      },

      birthday: {
        type: String,
      },

      joiningDate: {
        type: String,
      },

      role: {
        type: String,
        default:
          "employee",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );