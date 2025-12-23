import Razorpay from "razorpay";
import subscriptions from "../models/subscriptionModel.js";
import User from "../models/userModel.js";

export const PLANS = {
  plan_Rv0JLJgLsytOT7: {
    storageQuotaBytes: 2 * 1024 ** 4,
  },
  plan_Rv0JkbJqsK1uw9: {
    storageQuotaBytes: 2 * 1024 ** 4,
  },
  plan_Rv0KBTE3Dktt3g: {
    storageQuotaBytes: 5 * 1024 ** 4,
  },
  plan_Rv0Kn7hatXAAGa: {
    storageQuotaBytes: 5 * 1024 ** 4,
  },
  plan_Rv0LGGAbxfiNCx: {
    storageQuotaBytes: 10 * 1024 ** 4,
  },
  plan_Rv0Lhr8x2waOQ4: {
    storageQuotaBytes: 10 * 1024 ** 4,
  },
};

export const handleRazorpayWebhook=async (req,res)=>{
  const signature = req.headers["x-razorpay-signature"];
  const isSignature=Razorpay.validateWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.RAZORPAY_WEBHOOK_SECRET
  )
  if(isSignature){
    console.log("Signature verified");
    console.log(req.body);
    if(req.body.event==="subscription.activated"){
      const rzpSubscription=req.body.payload.subscription.entity
      const plainId=rzpSubscription.plan_id
      const subs=await subscriptions.findOne({
        razorpaySubscriptionId:rzpSubscription.id
      })
      subs.status=rzpSubscription.status
      await subs.save()
      const storageQuotaBytes=PLANS[plainId].storageQuotaBytes
      const user=await User.findById(subs.userId)
      user.maxStorageInBytes=storageQuotaBytes
      await user.save()
      console.log("subscription activated");
    }
  }else{
    console.log("signature invalid");

  }
  res.end("OK")
}