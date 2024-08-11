const db = require("../../models");
const Assets = db.Assets;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body assets controller =====>", req.body);
    //

    let assets = {
      name: req.body.item.name,
      price: req.body.item.price,
    };

    //save the assets in db
    assets = await Assets.create(assets);
    await Activity.create({
      action: "New assets Created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: assets,
      // Activity,
      message: "assets created successfully",
    });
  } catch (err) {
    // res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while creating the Tutorial."
    //   });
    console.log("Error handling =>", err);
    // console.log("catch block")
    next();
  }
};

// list program categorys
exports.list = async (req, res, next) => {
  try {
    const allAssets = await Assets.findAndCountAll();
    let { page, limit, name } = req.query;

    console.log("allAssets", allAssets.count);
    console.log("req.queryy", req.query); //name
    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.name = { $LIKE: name, $options: "gi" };
    }

    const total = allAssets.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    console.log("filter", filter);
    const faqs = await Assets.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // Anasite - Edits: Total price
    const totalPrice = await allAssets.rows?.reduce(
      (accumulator, singleAsset) => {
        return +accumulator + +singleAsset.price;
      },
      0
    );
    // res.send(allAssets);
    return res.send({
      success: true,
      message: "program categorys fetched successfully",
      data: {
        faqs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
        totalPrice,
      },
    });
  } catch (err) {
    res.send("assets Error " + err);
  }
  // next();
};

// API to edit assets
exports.edit = async (req, res, next) => {
  try {
    let payload = {
      name: req.body.item.name,
      price: req.body.item.price,
    };
    const assets = await Assets.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          ID: req?.body?.item.ID,
        },
      }
    );
    await Activity.create({
      action: "New assets updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "assets updated successfully",
      assets,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete assets
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const assets = await Assets.destroy({
        where: { ID: id },
      });
      await Activity.create({
        action: " assets deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (assets)
        return res.send({
          success: true,
          message: "assets Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "assets Page not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "assets Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a assets
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", Assets);
      const assets = await Assets.findByPk(id);

      if (assets)
        return res.json({
          success: true,
          message: "assets retrieved successfully",
          assets,
        });
      else
        return res.status(400).send({
          success: false,
          message: "assets not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "assets Id is required",
      });
  } catch (error) {
    return next(error);
  }
};
