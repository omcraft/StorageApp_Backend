import Razorpay from "razorpay";
import Subscription from "../models/subscriptionModel.js";

const rzpInstance = new Razorpay({
  key_id: "rzp_test_Rr3XAdbKhkrmbM",
  key_secret: "d3c6FJ1y4TdPCvpGwcY8GXlw",
});

export const createSubscription = async (req, res, next) => {
  try {
    const newSubscription = await rzpInstance.subscriptions.create({
      plan_id: req.body.planId,
      total_count: 120,
      notes: {
        userId: req.user._id,
      },
    });

    const subscription = new Subscription({
      razorpaySubscriptionId: newSubscription.id,
      userId: req.user._id,
    });

    await subscription.save();
    res.json({ subscriptionId: newSubscription.id });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
