import express from 'express';
import dotenv from 'dotenv';
import stripePackage from 'stripe';

dotenv.config();

// start server
const app = express();

app.use(express.static('public'));
app.use(express.json());

const stripeGateway = stripePackage(process.env.stripe_key);

// home 
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.get('/cart.html', (req, res) => {
    res.sendFile('cart.html', { root: 'public' });
});

app.get('/success.html', (req, res) => {
    res.sendFile('success.html', { root: 'public' });
});

app.get('/cancel.html', (req, res) => {
    res.sendFile('cancel.html', { root: 'public' });
});

app.post('/stripe-checkout', async (req, res) => {
    try {
        const lineItems = req.body.items.map((item) => {
            const unitAmount = parseInt(parseFloat(item.price) * 100);
            console.log('item-price:', item.price);
            console.log('unitAmount:', unitAmount);
            return {
                price_data: {
                    currency: 'usd', // Ensure you use the correct currency code
                    product_data: {
                        name: item.title, // Changed to 'name' from 'nama'
                        images: [item.image],
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        });

        const session = await stripeGateway.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `http://localhost:3000/success.html`,
            cancel_url: `http://localhost:3000/cancel.html`,
            billing_address_collection: 'required',
            line_items: lineItems,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(400).json({ error: 'Failed to create Stripe checkout session' });
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
