# DataPods - Decentralized Personal Data Vaults

A Web3 platform for securely managing personal data using Polkadot blockchain and IPFS storage. DataPods enables users to store, control access, and monetize their personal data while maintaining full ownership and privacy.

## 🚀 Features

- **Decentralized Storage**: Files stored on IPFS for immutable, distributed storage
- **Blockchain Security**: Polkadot integration for secure authentication and access control
- **Wallet Integration**: Support for MetaMask and WalletConnect
- **Access Management**: Grant/revoke permissions to data vaults
- **File Management**: Upload, download, and organize files in secure vaults
- **Real-time Monitoring**: Track all access requests and data usage
- **Encryption**: Optional client-side encryption for sensitive data

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Polkadot)    │
│                 │    │                 │    │                 │
│ • Wallet UI     │    │ • REST API      │    │ • Authentication│
│ • File Manager  │    │ • IPFS Client   │    │ • Access Control│
│ • Dashboard     │    │ • MongoDB       │    │ • Smart Contracts│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │      IPFS       │
                    │   (Storage)     │
                    │                 │
                    │ • File Storage  │
                    │ • Content Hash  │
                    │ • Distributed   │
                    └─────────────────┘
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- IPFS node or Infura IPFS API access
- MetaMask or compatible Web3 wallet

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nevilsonani/datapods.git
cd DataPods
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

#### Backend Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/datapods

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d

# IPFS Configuration
IPFS_API_URL=/ip4/127.0.0.1/tcp/5001
# Or use Infura IPFS
# IPFS_API_URL=https://ipfs.infura.io:5001
# INFURA_PROJECT_ID=your_project_id
# INFURA_API_KEY=your_api_key

# Polkadot Network
POLKADOT_NETWORK=wss://rpc.polkadot.io

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api/v1" > .env
```

### 4. Database Setup

Make sure MongoDB is running:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. IPFS Setup

#### Option A: Local IPFS Node
```bash
# Install IPFS
npm install -g ipfs

# Initialize and start IPFS
ipfs init
ipfs daemon
```

#### Option B: Use Infura IPFS
1. Sign up at [Infura.io](https://infura.io)
2. Create a new IPFS project
3. Update your backend `.env` with Infura credentials

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend Application

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Get Nonce for Wallet Authentication
```http
GET /api/v1/auth/nonce/:walletAddress
```

#### Login with Signed Message
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "walletAddress": "0x...",
  "signature": "0x..."
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Vault Endpoints

#### Get All Vaults
```http
GET /api/v1/vaults
Authorization: Bearer <token>
```

#### Create New Vault
```http
POST /api/v1/vaults
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Vault",
  "description": "Personal documents",
  "isEncrypted": false
}
```

#### Get Vault Details
```http
GET /api/v1/vaults/:id
Authorization: Bearer <token>
```

#### Update Vault
```http
PUT /api/v1/vaults/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Vault Name",
  "description": "Updated description"
}
```

#### Delete Vault
```http
DELETE /api/v1/vaults/:id
Authorization: Bearer <token>
```

#### Grant Access to Vault
```http
POST /api/v1/vaults/:id/access
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id_here",
  "permission": "read" // "read", "write", or "admin"
}
```

#### Revoke Access from Vault
```http
DELETE /api/v1/vaults/:id/access/:userId
Authorization: Bearer <token>
```

## 🔧 Development

### Project Structure

```
DataPods/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and server configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Authentication and error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # External service integrations
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── public/
├── contracts/               # Smart contracts (future implementation)
└── README.md
```

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

#### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🔐 Security Features

- **Wallet-based Authentication**: No passwords, only cryptographic signatures
- **JWT Tokens**: Secure session management
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data leakage
- **Rate Limiting**: Protection against abuse (recommended for production)

## 🌐 Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/datapods
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Build and Deploy**
   ```bash
   npm install --production
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Static Hosting**
   - Netlify, Vercel, or AWS S3
   - Update `REACT_APP_API_URL` to production backend URL

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/DataPods/issues)
- **Discussions**: Join our [Discord Community](https://discord.gg/datapods)

## 🗺️ Roadmap

- [ ] Smart contract integration for on-chain access control
- [ ] Advanced encryption with key management
- [ ] Data monetization marketplace
- [ ] Mobile application
- [ ] Multi-chain support (Ethereum, BSC, etc.)
- [ ] Decentralized identity integration
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and quotas
- [ ] Automated testing suite
- [ ] Performance monitoring

