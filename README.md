# shopify-product-customizer
This Shopify product customizer with dynamic pricing, allows merchants to offer tailored product options, enables customers to personalize products with real-time pricing updates and seamless integration with Shopify’s cart and checkout.

This project enhances Shopify’s product pages with customizable options (e.g., custom text, image uploads, initials) and gift packaging selection. It integrates with the cart drawer to display images and dynamically adjust pricing.

Project Structure

1. Product Page Components

These files manage the product page’s layout, input fields, and variant selection logic.
	•	sections/main-product.liquid – Contains the HTML, CSS, Liquid, and Schema for the product display.
	•	snippets/product-variant-options.liquid – Handles product variant selection logic.
	•	assets/product-info.js – Manages custom input options such as text input and file uploads.
	•	assets/product-form.js – Controls the Gift Packaging Add-To-Cart (ATC) functionality.

2. Cart Page Enhancements

These files modify how product images and customizations are displayed in the cart.
	•	snippets/cart-drawer.liquid – Controls cart drawer product image display.
	•	sections/main-cart-items.liquid – Handles cart page product image display.
	•	assets/cart.js – Manages cart modification functionality, including item updates.

Features & Setup

Product Customization (Personalized Options)

This functionality allows merchants to offer custom input fields, enabling customers to personalize their products.

Supported Input Fields:
	1.	Custom text input
	2.	Upload design (image)
	3.	Initials (short text)

Setup Instructions:
	•	Configure product variant options in Shopify.
	•	Add custom fields using product metafields.

Metafield Configuration:
	•	Type: Checkbox (True/False)
	•	Namespace & Key: Set up the metafield namespace and key to enable this feature.

Gift Packaging Feature

This feature enables customers to select gift packaging for their purchases.

Setup Instructions:
	1.	Enable the “Gift Packaging” block in the Shopify theme editor.
	2.	Select the appropriate gift packaging option.
	3.	Ensure the gift packaging product exists in the Shopify Admin.

Next Steps

To further enhance functionality:
	•	Add validation for custom input fields.
	•	Improve UI elements for cart image previews.
	•	Optimize the logic for selecting and applying gift packaging.

Notes
	•	Ensure metafields are correctly configured before testing product customization features.
	•	The cart drawer and cart page should be updated to reflect dynamic image changes.
	•	The Shopify theme editor should be used to configure personalized options and gift packaging.