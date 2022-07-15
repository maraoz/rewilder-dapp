## Get Started

Install dependencies

```
npm install
```

Copy `.env.example` to `.env.local` and fill in environment variables

```
FIREBASE_CLIENT_EMAIL=xxxxxxxxx
etc ...
```

Run a local hardhat node:
```
npx hardhat node
```

Deploy the contracts locally:
```
npx hardhat run ./scripts/deploy.js --network localhost
```

Run the development server:
```
npm run dev
```

When the above command completes you'll be able to view the web app at `http://localhost:3000`



