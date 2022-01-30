const { Order } = require("../models/orderModel");
const { OrderItem } = require("../models/orderItemModel");
const Joi = require("joi");
const pagination = require("../services/paginationService");

exports.ordersList = async (req, res, next) => {
  try {
    let projection = {};
    if (req?.query?.hasOwnProperty("fields")) {
      projection = req?.query?.fields?.split(",").reduce((total, current) => {
        return { [current]: 1, ...total };
      }, {});
    }

    const apiName = "orders";
    const limit = process.env.PER_PAGE;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    const ordersCount = await Order.count();
    const totalPages = Math.ceil(ordersCount / limit);

    const orderList = await Order.find({}, projection)
      .populate("user", "name")
      .sort({ dateOrdered: -1 })
      .limit(limit)
      .skip(offset);

    if (!orderList) return res.status(500).json({ success: false });

    return res.send({
      success: true,
      message: "List of Order fetched successfully.",
      data: {
        orderList,
      },
      meta: pagination({ totalPages, page, apiName, limit }),
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!order) return res.status(400).send("the order cannot be update!");

    res.send(order);
  } catch (error) {
    next(error);
  }
};

exports.addOrder = async (req, res, next) => {
  try {
    const schema = Joi.object({
      orderItems: Joi.array().required(),
      shippingAddress1: Joi.string().min(3).max(200).required(),
      shippingAddress2: Joi.string().min(3).max(200),
      city: Joi.string().max(10).required(),
      zipCode: Joi.string().max(10),
      country: Joi.string().max(200).required(),
      phone: Joi.string().min(8).max(10).required(),
      status: Joi.string().min(3).max(200).required(),
      totalPrice: Joi.number().max(20),
      user: Joi.string().max(50),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
      orderItems,
      shippingAddress1,
      shippingAddress2,
      city,
      zipCode,
      country,
      phone,
      status,
      user,
    } = req.body;

    const orderItemsIds = Promise.all(
      orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );

        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    console.log(orderItemsIdsResolved);
    let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1,
      shippingAddress2,
      city,
      zipCode,
      country,
      phone,
      status,
      totalPrice,
      user,
    });

    order = await order.save();

    if (!order) return res.status(500).json({ success: false });

    return res.status(201).send(order);
  } catch (error) {
    next(error);
  }
};

exports.removeOrder = async (req, res, next) => {
  try {
    Order.findByIdAndRemove(req.params.id).then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!order) return res.status(400).send("the order cannot be update!");

    res.send(order);
  } catch (error) {
    next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const userOrderList = await Order.find({ user: req.params.userid })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      })
      .sort({ dateOrdered: -1 });

    if (!userOrderList) {
      res.status(500).json({ success: false });
    }
    res.send(userOrderList);
  } catch (error) {
    next(error);
  }
};

exports.orderCount = async (req, res, next) => {
  try {
    const orderCount = await Order.countDocuments((count) => count);

    if (!orderCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      orderCount: orderCount,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTotalPrice = async (req, res, next) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales) {
      return res.status(400).send("The order sales cannot be generated");
    }

    res.send({ totalsales: totalSales.pop().totalsales });
  } catch (error) {
    next(error);
  }
};
