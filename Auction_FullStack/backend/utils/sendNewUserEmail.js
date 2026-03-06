import { sendEmail } from "./sendEmailFunc.js";

const sendNewUserEmail = async (user) => {
    let subject = "";
    let message = "";

    if (user.role === "Auctioneer") {
        subject = "Welcome to Auction Walaa – Start Listing Your Auctions 🚀";

        message = `
Hello ${user.userName},

Welcome to Auction Walaa!

Your Auctioneer account has been successfully created.

You can now:
• Create auctions
• Manage your listings
• Receive bids from users
• Track your earnings and commissions

Your registered payment methods will be used when buyers complete payments.

Login and start listing your first auction today!

If you need help, contact our support team anytime.

Best regards  
Team Auction Walaa
`;
    }

    else {
        subject = "Welcome to Auction Walaa – Start Bidding Today 🎉";

        message = `
Hello ${user.userName},

Welcome to Auction Walaa!

Your Bidder account has been successfully created.

You can now:
• Explore live auctions
• Place bids on items
• Compete with other bidders
• Win exciting products

Once you win an auction, the auctioneer will contact you for payment and delivery.

Start exploring auctions now and place your first bid!

Best regards  
Team Auction Walaa
`;
    }

    await sendEmail({
        email: user.email,
        subject,
        message,
    });
};

export { sendNewUserEmail };