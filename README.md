# 🐾 Petshop API

> Some portions of this codebase were developed with the assistance of artificial intelligence tools to improve productivity and maintain best practices.

The Petshop API is a RESTful service designed to manage the operations of a modern pet care business. It provides endpoints for handling customers, pets, services, bookings, and user authentication. Built with Node.js and Express, it supports secure JWT-based login and integrates seamlessly with Swagger UI for interactive documentation.

---

## 🚀 Features

- 🐶 **Pet Management** – Register, update, and delete pets linked to customers
- 👥 **Customer Records** – Full CRUD operations for customer data
- 🧼 **Service Catalog** – Define and manage services like grooming, training, and veterinary care
- 📅 **Booking System** – Schedule services for pets with conflict prevention
- 🔐 **Authentication** – Secure login and signup with hashed passwords and JWT
- 🧑‍💻 **Admin Tools** – Manage employees and sessions with role-based access

---

## 📦 Technologies Used

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

---

## 📄 API Documentation

Interactive Swagger UI available on `/docs` after running the code.

You can test all endpoints directly from the browser.

---

## 🛠 Installation

```bash
git clone https://github.com/hannaseraphim/petshop-api.git
cd petshop-api
npm install
npm run dev
```

Create a `.env` file with the following variables:

```bash
JWT_SIGN_KEY=your_secret_key
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=petshop
FRONT_END_URL=https://example.com
```

Check `.env.sample` for more information aboout what these do.

## 📚 Wiki

For detailed usage, data models, and contribution guidelines, visit the [Wiki](https://github.com/hannaseraphim/petshop-api-ts/wiki)

## 🤝 Contributing

We welcome contributions! Please fork the repository, create a feature branch, and submit a pull request. All code is reviewed by human maintainers.

```bash
git checkout -b feature-name
git commit -m "Add feature"
git push origin feature-name
```

## 📬 Contact

For questions or support, reach out to my email on [hannaseraphim@gmail.com](mailto:hannaseraphim@gmail.com).

## 📝 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

© 2025 Hanna. All rights reserved.
