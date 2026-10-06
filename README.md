# ArtHub Client

ArtHub is a modern online marketplace for original artworks where independent artists can publish and manage their work, and collectors can discover, save, and purchase unique pieces.

## Live Website

Live URL: Add after deployment

## Project Purpose

The purpose of ArtHub is to create a simple and visually engaging platform that connects independent artists with art collectors.

Artists can publish and manage their artworks, while collectors can browse artworks, save favorites, purchase available pieces, and view their personal collection.

## Main Features

- Responsive modern art marketplace interface
- Email and password authentication
- Google authentication
- Separate Artist and Art Collector roles
- Browse all artworks
- Search artworks by title or artist
- Filter artworks by category
- Filter artworks by minimum and maximum price
- Sort artworks by newest and price
- View artwork details
- Save and remove favorite artworks
- My Favorites dashboard
- Stripe Checkout payment flow
- My Collection for purchased artworks
- Sold artwork indicators
- Artist dashboard
- Publish new artworks
- Update unsold artworks
- Delete unsold artworks
- Sold artworks cannot be edited or deleted
- Responsive navigation and dashboard
- Loading, error, empty, and success states
- Toast notifications
- Custom confirmation modal

## User Roles

### Art Collector

Collectors can:

- Browse artworks
- View artwork details
- Save artworks to favorites
- Remove favorites
- Purchase available artworks
- View purchased artworks in My Collection

### Artist

Artists can:

- Publish artworks
- View their own published artworks
- Update unsold artworks
- Delete unsold artworks
- View sold status

Artist accounts cannot purchase artworks.

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Better Auth
- Stripe Checkout
- Lucide React
- React Hot Toast
- MongoDB through the ArtHub backend API

## NPM Packages

Major packages used in the client include:

```text
next
react
react-dom
better-auth
lucide-react
react-hot-toast