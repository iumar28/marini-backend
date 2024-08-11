const db = require("../../models");
const Liabilities = db.Liabilities;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body liabilities controller =====>", req.body);
    //

    let liabilities = {
      name: req.body.item.name,
      price: req.body.item.price,
    };

    //save the liabilities in db
    liabilities = await Liabilities.create(liabilities);
    await Activity.create({
      action: "New liabilities Created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: liabilities,
      // Activity,
      message: "liabilities created successfully",
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
    const allLiabilities = await Liabilities.findAndCountAll();
    let { page, limit, name } = req.query;

    console.log("allLiabilities", allLiabilities.count);
    console.log("req.queryy", req.query); //name
    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.name = { $LIKE: name, $options: "gi" };
    }

    const total = allLiabilities.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    console.log("filter", filter);
    const faqs = await Liabilities.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // Anasite - Edits: Total price
    const totalPrice = await allLiabilities.rows?.reduce(
      (accumulator, singleAsset) => {
        return +accumulator + +singleAsset.price;
      },
      0
    );
    // res.send(allLiabilities);
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
    res.send("liabilities Error " + err);
  }
  // next();
};

// API to edit liabilities
exports.edit = async (req, res, next) => {
  try {
    let payload = {
      name: req.body.item.name,
      price: req.body.item.price,
    };
    const liabilities = await Liabilities.update(
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
      action: "New liabilities updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "liabilities updated successfully",
      liabilities,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete liabilities
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const liabilities = await Liabilities.destroy({
        where: { ID: id },
      });
      await Activity.create({
        action: " liabilities deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (liabilities)
        return res.send({
          success: true,
          message: "liabilities Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "liabilities Page not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "liabilities Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a liabilities
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", Liabilities);
      const liabilities = await Liabilities.findByPk(id);

      if (liabilities)
        return res.json({
          success: true,
          message: "liabilities retrieved successfully",
          liabilities,
        });
      else
        return res.status(400).send({
          success: false,
          message: "liabilities not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "liabilities Id is required",
      });
  } catch (error) {
    return next(error);
  }
};
