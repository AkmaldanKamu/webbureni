import express from "express"
import dotenv from "dotenv"
import stripe from "stripe"

dotenv.config();

// start server
const app = express();

app.use(express.static("public"));
app.use(express.json());

// home 
app.get("/", (req, res) =>{
    res.sendFile("index.html",{root:"public"})
});

app.get("/cart.html", (req, res) =>{
    res.sendFile("cart.html",{root:"public"})
});

app.get("/success.html", (req, res) =>{
    res.sendFile("success.html",{root:"public"})
});

app.get("/cancel.html", (req, res) =>{
    res.sendFile("cancel.html",{root:"public"})
});

let stripeGateway = stripe(process.env.stripe_key)
app.post("/stripe-checkout",async(req,res) =>{
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types:["card"],
        mode:"payment",
        success_url:`http://localhost:3000/success.html`,
        cancel_url:`http://localhost:3000/cancel.html`,
    })
})

app.listen(3000, () => {
    console.log("listing on port 3000");
});