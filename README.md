# E-Commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, Express, and MongoDB. Features a responsive design, secure authentication, payment integration, and comprehensive admin panel.

## 🚀 Features

### Frontend
- **Modern React UI** with Tailwind CSS
- **Responsive Design** for all devices
- **Product Catalog** with search, filtering, and sorting
- **Shopping Cart** with persistent storage
- **User Authentication** (Register, Login, Profile Management)
- **Order Management** and tracking
- **Payment Integration** (Razorpay, PayU, COD)
- **Address Management** for shipping
- **Product Reviews** and ratings
- **Wishlist** functionality

### Backend
- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with role-based access
- **File Upload** with Cloudinary integration
- **Email Service** for notifications
- **Payment Gateway** integration
- **Order Management** system
- **Admin Panel** capabilities
- **Input Validation** and error handling
- **Rate Limiting** and security middleware

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- React Query/TanStack Query
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt.js
- Cloudinary
- Nodemailer
- Express Validator
- Morgan (Logging)
- CORS

### Payment Gateways
- Razorpay
- PayU
- Cash on Delivery

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)
- Payment gateway accounts (Razorpay/PayU)

### Clone Repository
```bash
git clone <repository-url>
cd ecommerce_trial_1
```

### Backend Setup
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Start the server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Start the development server
npm run dev
```

## ⚙️ Configuration

### Backend Environment Variables
Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PAYU_MERCHANT_KEY=your_payu_merchant_key
PAYU_SALT=your_payu_salt

FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_PAYU_MERCHANT_KEY=your_payu_merchant_key
VITE_APP_NAME=E-Commerce Store
```

## 🚀 Running the Application

### Development Mode
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Production Mode
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
ecommerce_trial_1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   ├── cart.js
│   │   │   ├── users.js
│   │   │   └── payments.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   ├── cart.js
│   │   │   ├── users.js
│   │   │   └── payments.js
│   │   ├── utils/
│   │   │   ├── sendEmail.js
│   │   │   └── cloudinary.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Update password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove cart item

### Payments
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment
- `POST /api/payments/payu/create-order` - Create PayU order
- `GET /api/payments/methods` - Get payment methods

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable protection
- Error handling middleware

## 🎨 UI Components

- Responsive navigation
- Product cards and grids
- Shopping cart interface
- User authentication forms
- Order management dashboard
- Payment integration forms
- Admin panel components

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set up environment variables
2. Configure MongoDB connection
3. Set up Cloudinary
4. Configure payment gateways
5. Deploy using your preferred platform

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Set up environment variables
3. Deploy the `dist` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@ecommerce.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core e-commerce functionality
- Full-stack implementation with React and Node.js
- Payment gateway integration
- Admin panel capabilities
- Responsive design

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-vendor support
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Advanced search with Elasticsearch
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Advanced inventory management
- [ ] Subscription-based products#   D r e s s E C o m m e r c e  
 