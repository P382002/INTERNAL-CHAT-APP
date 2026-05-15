const express =
  require("express");

const router =
  express.Router();

const Group =
  require("../models/Group");


// GET GROUPS
router.get(
  "/",
  async (req, res) => {

    try {

      const groups =
        await Group.find()
          .populate(
            "members"
          );

      res.json(groups);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);


// CREATE GROUP
router.post(
  "/",
  async (req, res) => {

    try {

      const group =
        new Group({
          name:
            req.body.name,
          members: [],
        });

      await group.save();

      res.json(group);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);


// EDIT GROUP
router.put(
  "/:id",
  async (req, res) => {

    try {

      const updatedGroup =
        await Group.findByIdAndUpdate(
          req.params.id,
          {
            name:
              req.body.name,
          },
          {
            new: true,
          }
        );

      res.json(
        updatedGroup
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);


// DELETE GROUP
router.delete(
  "/:id",
  async (req, res) => {

    try {

      await Group.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Group deleted",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);


// ADD MEMBER
router.put(
  "/:id/add-member",
  async (req, res) => {

    try {

      const group =
        await Group.findById(
          req.params.id
        );

      if (
        !group.members.includes(
          req.body.userId
        )
      ) {

        group.members.push(
          req.body.userId
        );
      }

      await group.save();

      res.json(group);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);


// REMOVE MEMBER
router.put(
  "/:id/remove-member",
  async (req, res) => {

    try {

      const group =
        await Group.findById(
          req.params.id
        );

      group.members =
        group.members.filter(
          (member) =>
            member.toString() !==
            req.body.userId
        );

      await group.save();

      res.json(group);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);

module.exports =
  router;