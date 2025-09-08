# 🛒 Angular E-commerce

Projet e-commerce complet réalisé avec **Angular 20**, **PrimeNG 20** et **TailwindCSS**.  
Il est relié à un backend développé en **Spring Boot**.

---

## 🚀 Démo

- **Frontend (Angular GitHub Pages)** : [https://mathieu-vdt.github.io/angular-ecommerce/](https://mathieu-vdt.github.io/angular-ecommerce/)  
- **Backend API (Spring Boot sur Render)** : [https://spring-ecommerce-back.onrender.com/api/products](https://spring-ecommerce-back.onrender.com/api/products)

⚠️ Le backend Render gratuit peut se mettre en "sleep" après une période d’inactivité.  
👉 **Visitez d’abord l’API** pour la réveiller avant de tester le front.

---

## ✨ Fonctionnalités

### 🏠 Pages principales
- **Home** : liste de tous les produits avec possibilité d’ajouter un produit au panier  
- **Product** : page détaillée pour chaque produit  
- **Login / Register** : authentification et inscription des utilisateurs  
- **FAQ** : section questions fréquentes  
- **Contact** : formulaire de contact  

### 🛒 Panier
- Ajouter un produit au panier depuis la Home ou la page Produit  
- Consultation du panier avec détails des produits sélectionnés  

### 🔑 Administration
- **Page Admin** accessible uniquement à l’utilisateur **admin** (connexion requise)  
- CRUD complet sur :
  - Utilisateurs
  - Produits
  - Commandes

---

## 🛠️ Stack technique

### Frontend
- [Angular 20](https://angular.dev/)
- [PrimeNG 20](https://primeng.org/) (UI components)
- [TailwindCSS](https://tailwindcss.com/) (CSS utility-first)

### Backend
- [Spring Boot](https://spring.io/projects/spring-boot)  
➡️ Repo backend : [mathieu-vdt/spring-ecommerce-back](https://github.com/mathieu-vdt/spring-ecommerce-back)

---

## 📦 Installation locale

### Frontend
```bash
git clone https://github.com/mathieu-vdt/angular-ecommerce.git
cd angular-ecommerce
npm install
ng serve
