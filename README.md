
# E-Commerce Decor Website

This is a full-stack e-commerce website built with the MERN stack (MongoDB, Express.js, React, Node.js) and Next.js for the frontend. It features a complete shopping experience, from browsing products to a fully functional checkout process. The website also includes an admin dashboard for managing products, orders, and users.

## Features

### Frontend

*   **Responsive Design:** The website is fully responsive and works on all devices.
*   **Theme Provider:** The website uses a theme provider to allow for easy customization of the website's appearance.
*   **Product Listings:** Products are displayed in a clean and organized manner, with options to sort and filter.
*   **Product Details:** Each product has a dedicated page with a detailed description, images, and an "add to cart" button.
*   **Shopping Cart:** A fully functional shopping cart that allows users to add, remove, and update the quantity of products.
*   **Checkout Process:** A seamless checkout process with a multi-step form for shipping and payment information.
*   **User Authentication:** Users can sign up, log in, and manage their profiles.
*   **Admin Dashboard:** A comprehensive admin dashboard for managing products, orders, and users.
*   **UI Components:** A rich set of UI components, including carousels, accordions, dialogs, and more.

### Backend

*   **RESTful API:** A well-structured RESTful API for managing products, orders, users, and payments.
*   **Database:** MongoDB is used as the database, with Mongoose as the ODM.
*   **Authentication:** JWT-based authentication for securing the API endpoints.
*   **Payment Gateway:** Integration with a payment gateway for processing payments.
*   **Order Management:** A complete order management system, including order creation, status updates, and order history.
*   **User Management:** A user management system for creating, updating, and deleting users.
*   **Product Management:** A product management system for creating, updating, and deleting products.

## Technologies Used

*   **Frontend:**
    *   Next.js
    *   React
    *   TypeScript
    *   Tailwind CSS
    *   Shadcn UI
*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB
    *   Mongoose
    *   Prisma
    *   Clerk
    *   Inngest
*   **Deployment:**
    *   Render

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/your_project_name.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env` file in the root directory and add the following environment variables:
    ```
    DATABASE_URL=
    CLERK_SECRET_KEY=
    INNGEST_EVENT_KEY=
    ```
4.  Start the development server
    ```sh
    npm run dev
    ```

## Usage

Once the development server is running, you can access the website at `http://localhost:3000`. The admin dashboard is available at `http://localhost:3000/admin`.
