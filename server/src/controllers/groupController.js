const Group = require("../models/Group");

const User = require("../models/User");

// GET GROUPS
exports.getGroups = async (
  req,
  res
) => {
  try {
    const groups =
      await Group.find()
        .populate(
          "members",
          "name email"
        );

    res.json(groups);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
};

// CREATE GROUP
exports.createGroup = async (
  req,
  res
) => {
  try {
    const group = new Group({
      name: req.body.name,
      members: [],
    });

    await group.save();

    res.json(group);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server error",
    });
  }
};

// ADD USER TO GROUP
exports.addUserToGroup =
  async (req, res) => {
    try {
      const {
        groupId,
        userId,
      } = req.body;

      const group =
        await Group.findById(
          groupId
        );

      if (!group) {
        return res
          .status(404)
          .json({
            error:
              "Group not found",
          });
      }

      const user =
        await User.findById(
          userId
        );

      if (!user) {
        return res
          .status(404)
          .json({
            error:
              "User not found",
          });
      }

      if (
        group.members.includes(
          userId
        )
      ) {
        return res
          .status(400)
          .json({
            error:
              "User already added",
          });
      }

      group.members.push(
        userId
      );

      await group.save();

      const updatedGroup =
        await Group.findById(
          groupId
        ).populate(
          "members",
          "name email"
        );

      res.json(updatedGroup);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Server error",
      });
    }
  };

// REMOVE USER FROM GROUP
exports.removeUserFromGroup =
  async (req, res) => {
    try {
      const {
        groupId,
        userId,
      } = req.body;

      const group =
        await Group.findById(
          groupId
        );

      if (!group) {
        return res
          .status(404)
          .json({
            error:
              "Group not found",
          });
      }

      group.members =
        group.members.filter(
          (memberId) =>
            memberId.toString() !==
            userId
        );

      await group.save();

      const updatedGroup =
        await Group.findById(
          groupId
        ).populate(
          "members",
          "name email"
        );

      res.json(updatedGroup);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Server error",
      });
    }
  };