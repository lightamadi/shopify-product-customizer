if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector('form');
        this.variantIdInput.disabled = false;
          // wrpeToCart()
        // this.form.addEventListener('submit', this.onSubmitHandler.bind(this)); // -- Default for reference.
        this.form.addEventListener('submit', (event) => {
          event.preventDefault();
          setTimeout(() => {
            this.onSubmitHandler(event);
          }, 500); // 000 milliseconds delay
        });


        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector('span');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              });

            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              this.cart.renderContents(response);
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading__spinner').classList.add('hidden');
          });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    }
  );
}

// ------------ Gift wrap js -----------
function addToCart(variantId, quantity) {
  const identifier= new Date().getTime();
  return fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: variantId,
      quantity: quantity,
      properties: { 'ID': identifier }
    })
  })
  .then(response => response.json())
  .then(data => {
    // console.log('Added to cart:', data);
    // Update cart UI
    // updateCartUI();
  })
  .catch(error => {
    console.error('Error adding to cart:', error);
  });
}


  const giftWrap = document.getElementById("gift-wrap");
  const selectorCont = document.querySelector(".selector_cont");
  const variantSelector = document.getElementById("variant-selector");
  const giftWrapeId = document.getElementById("gift_wrape_id");

function wrpeToCart(){
  const variantId = giftWrapeId.getAttribute("data-selected-option")
  if (variantId){
  const quantity = 1
    addToCart(variantId, quantity)
  }
}

const giftPackaging = document.getElementById("gift_packaging");
const dataFormId = giftPackaging.dataset.form
const defaultATC = document.querySelector(".product-form__buttons button[type='submit']")
defaultATC.addEventListener('click', wrpeToCart);


  if (giftWrap && variantSelector && selectorCont) {
    giftWrap.addEventListener("change", function(event) {
      const checkBox = event.target.checked;
      if (checkBox) {
        selectorCont.classList.remove("disable_unselect");
        
        const selectedOption = variantSelector.options[variantSelector.selectedIndex];
        giftWrapeId.setAttribute("data-selected-option", selectedOption.value);
          giftPackaging.innerHTML = `
            <p data-option-name="Gift Packaging" class="line-item-property__field hidden">
              <label for="custom-text">Gift Packaging</label>
              <input form="${dataFormId}" required class="required" id="Gift Packaging" type="text" value="${selectedOption.dataset.variantName}" name="properties[Gift Packaging]">
            </p>`
        variantSelector.addEventListener("change", function(e) {
          const newSelectedOption = e.target.options[e.target.selectedIndex];
          giftWrapeId.setAttribute("data-selected-option", newSelectedOption.value);
          // console.log("newSelectedOption.title: ", newSelectedOption.dataset.variantName)
          giftPackaging.innerHTML = `
            <p data-option-name="Gift Packaging" class="line-item-property__field hidden">
              <label for="custom-text">Gift Packaging</label>
              <input form="${dataFormId}" required  class="required" id="Gift Packaging" type="text" value="${newSelectedOption.dataset.variantName}" name="properties[Gift Packaging]">
            </p>`
        });

      } else {
        selectorCont.classList.add("disable_unselect");
        giftWrapeId.removeAttribute("data-selected-option");
        giftPackaging.innerHTML = '';
      }
      console.log("Checked status: ", checkBox);
    });
  } else {
    console.error('One or more elements not found');
  }
