# ArtHub Client

ArtHub is a modern full-stack online marketplace for original artworks where collectors can discover and purchase art, artists can publish and manage their work, and administrators can manage the platform.

This repository contains the frontend application for ArtHub, built with Next.js, React, Tailwind CSS, Better Auth, Stripe integration, and responsive UI components.

---

## Live Website

https://arthub-client-sigma.vercel.app

---

## GitHub Repositories

**Client Repository:**  
https://github.com/Saklainmostak-learner/arthub-client

**Server Repository:**  
https://github.com/Saklainmostak-learner/arthub-server

---

## Project Purpose

The purpose of ArtHub is to create a complete online artwork marketplace where:

- Collectors can discover original artworks
- Users can save favorite artworks
- Collectors can purchase artworks securely
- Verified buyers can leave reviews
- Artists can publish and manage their own artworks
- Artists can track sales and revenue
- Users can subscribe to membership plans
- Administrators can manage users, artworks, transactions, and platform statistics

---

## Main Features

- Responsive modern user interface
- Email and password authentication
- Google OAuth authentication
- Better Auth session management
- Collector, Artist, and Admin roles
- Role-based dashboard
- Browse artworks
- Artwork search and filtering
- Category filtering
- Price filtering
- Artwork sorting
- Pagination
- Artwork details page
- Add artwork
- Edit artwork
- Delete artwork
- Artist ownership protection
- Sold artwork status
- Favorites system
- My Favorites page
- Stripe artwork checkout
- Artwork purchase confirmation
- My Collection
- Verified buyer reviews
- 1–5 star ratings
- Edit own reviews
- Delete own reviews
- Artist sales history
- Artist revenue statistics
- Membership pricing page
- Free membership
- Pro membership
- Premium membership
- Stripe subscription checkout
- Subscription cancellation
- Admin dashboard
- Admin platform statistics
- Admin user management
- Admin role management
- Admin artwork management
- Admin transaction management
- About page
- Contact page
- Privacy page
- Custom 404 page
- Toast notifications
- Responsive mobile navigation

---

## Technology Stack

- Next.js
- React
- JavaScript
- Tailwind CSS
- Better Auth
- Stripe
- Axios
- Lucide React
- React Icons
- React Hot Toast
- Recharts

---

## Major NPM Packages

```text
next
react
react-dom
better-auth
axios
lucide-react
react-icons
react-hot-toast
recharts
tailwindcss
```

---

## User Roles

ArtHub supports three user roles.

### Collector

Collector role value:

```text
user
```

Collectors can:

- Browse artworks
- View artwork details
- Save favorite artworks
- Remove favorite artworks
- Purchase available artworks
- View purchased artworks
- Submit reviews after verified purchases
- Edit their own reviews
- Delete their own reviews
- Subscribe to paid membership plans

---

### Artist

Artist role value:

```text
artist
```

Artists can:

- Browse artworks
- Add new artworks
- View their own artworks
- Edit their own unsold artworks
- Delete their own unsold artworks
- View sold artwork status
- View sales history
- View revenue statistics
- Subscribe to paid membership plans

Artists cannot purchase their own artworks.

---

### Admin

Admin role value:

```text
admin
```

Administrators can:

- View platform statistics
- View all users
- Change user roles
- Promote users
- Delete users
- View all artworks
- Delete artworks
- View transactions
- Monitor platform activity

The currently authenticated administrator is protected from removing their own admin role or deleting their own account.

---

## Authentication

Authentication is handled using Better Auth.

Supported authentication methods:

- Email and password
- Google OAuth

Production authentication requests are proxied through the Next.js frontend to the deployed backend.

---

## Main Routes

### Public Routes

```text
/
/about
/artworks
/artworks/[id]
/contact
/login
/register
/pricing
/privacy
```

### Dashboard Routes

```text
/dashboard
/dashboard/add-artwork
/dashboard/admin
/dashboard/favorites
/dashboard/my-artworks
/dashboard/my-artworks/[id]/edit
/dashboard/my-collection
/dashboard/sales
```

### Payment Routes

```text
/payment-success
/subscription-success
```

---

## Home Page

The home page includes:

- Hero section
- Featured artworks
- Art categories
- Top artists
- Navigation bar
- Footer

Featured artwork information is loaded from the backend database.

---

## Artwork Marketplace

The Browse Artworks page supports:

- Artwork listing
- Search by artwork information
- Category filtering
- Minimum price filtering
- Maximum price filtering
- Sorting
- Pagination
- Sold artwork status

Each artwork links to a dedicated details page.

---

## Artwork Details

The artwork details page includes:

- Artwork image
- Artwork title
- Artist information
- Category
- Price
- Description
- Availability status
- Favorite functionality
- Purchase functionality
- Reviews
- Average rating

Purchased artworks are marked as sold.

---

## Artist Dashboard

Artists can access tools for managing their marketplace activity.

Artist features include:

```text
/dashboard/add-artwork
/dashboard/my-artworks
/dashboard/sales
```

Artists can create, update, and delete their own unsold artworks.

Sold artworks cannot be modified or deleted by the artist.

---

## Collector Dashboard

Collectors can access:

```text
/dashboard/favorites
/dashboard/my-collection
```

Collectors can save favorite artworks and view artworks they have purchased.

---

## Reviews

Only verified buyers can submit reviews for purchased artworks.

Review features include:

- 1–5 star rating
- Review text
- Verified Buyer status
- Edit own review
- Delete own review

Users cannot edit or delete reviews created by other users.

---

## Stripe Artwork Payments

Stripe Checkout is used for artwork purchases.

The purchase flow includes:

1. Collector opens an available artwork
2. Collector starts Stripe Checkout
3. Payment is completed through Stripe
4. ArtHub verifies the Stripe Checkout session
5. Purchase information is stored
6. Artwork is marked as sold
7. Purchased artwork appears in My Collection

---

## Membership Plans

ArtHub currently supports:

### Free

```text
$0
```

### Pro

```text
$9 / month
```

### Premium

```text
$19 / month
```

Paid memberships use Stripe subscription checkout.

Users can also cancel a paid membership and return to the Free plan.

---

## Admin Dashboard

Admin dashboard route:

```text
/dashboard/admin
```

Admin features include:

- Platform statistics
- User count
- Artist count
- Collector count
- Admin count
- Artwork count
- Sold artwork count
- Transaction count
- Revenue information
- User management
- Role management
- Artwork management
- Transaction history

Admin credentials should be provided separately during assignment evaluation.

---

## Environment Variables

Create a `.env.local` file in the client root for local development.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AUTH_URL=http://localhost:5000
```

Do not commit real environment configuration files to GitHub.

The production frontend uses a Next.js proxy for authentication and backend API requests.

---

## Install and Run Locally

Clone the client repository:

```bash
git clone https://github.com/Saklainmostak-learner/arthub-client.git
```

Enter the project directory:

```bash
cd arthub-client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Available Scripts

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint

```bash
npm run lint
```

---

## Production Build

The application has been successfully tested with:

```bash
npm run build
```

Next.js generates all required public and dashboard routes successfully.

---

## Deployment

The frontend is deployed on Vercel.

**Production Website:**

https://arthub-client-sigma.vercel.app

The backend is deployed on Render.

**Production API:**

https://arthub-server-k64r.onrender.com

---

## Security

ArtHub includes:

- Better Auth session authentication
- Secure authentication cookies
- Role-based access control
- Protected backend APIs
- Artist ownership validation
- Collector-only purchase operations
- Admin-only management APIs
- Verified buyer review protection
- User-specific favorites
- User-specific collection data
- Sold artwork protection
- Secure environment variables
- Server-side role validation
- Protected admin account operations

---

## Responsive Design

The application is designed for:

- Mobile devices
- Tablets
- Laptops
- Desktop screens

Navigation, dashboards, forms, cards, and marketplace sections adapt to different screen sizes.

---

## Project Status

ArtHub currently includes the complete core workflow for:

- Collectors
- Artists
- Administrators
- Artwork discovery
- Artwork management
- Favorites
- Stripe payments
- Purchases
- Reviews
- Sales tracking
- Membership subscriptions
- Admin management
- Responsive user experience

The project is built with Next.js, React, Tailwind CSS, Better Auth, MongoDB-backed APIs, and Stripe.