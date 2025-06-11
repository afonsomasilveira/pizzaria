let cart = [];
let modalQt = 1;
let modalKey = 0;

const d = (element) => document.querySelector(element)
const da = (element) => document.querySelectorAll(element)

// Listagem das pizzas
function Pizzas(item, index) {
    let pizzaItem = d('.models .pizza-item').cloneNode(true);


    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        d('.pizzaBig img').src = pizzaJson[key].img;
        d('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        d('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        d('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        d('.pizzaInfo--size.selected').classList.remove('selected');

        da('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        d('.pizzaInfo--qt').innerHTML = modalQt;

        d('.pizzaWindowArea').style.opacity = 0;
        d('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            d('.pizzaWindowArea').style.opacity = 1;
        }, 200)

    })
    d('.pizza-area').append(pizzaItem)
}

pizzaJson.map(Pizzas)

//Eventos do MODAL 
function closeModal() {
    d('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        d('.pizzaWindowArea').style.display = 'none';
    }, 300)
}

da('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})
d('.pizzaInfo--qtminus').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        d('.pizzaInfo--qt').innerHTML = modalQt;
    }
})
d('.pizzaInfo--qtplus').addEventListener('click', () => {
    modalQt++;
    d('.pizzaInfo--qt').innerHTML = modalQt;
})
da('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        d('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    })
})
d('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(d('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '@' + size

    let key = cart.findIndex((item) => item.identifier == identifier)

    if (key > -1) {
        cart[key].qt += modalQt
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
})

//EVENTOS DO CART

function closeCart() {
    d('aside').style.width = '-100vw';
    d('aside').classList.remove('show')
}
d('.menu-closer').addEventListener('click', closeCart)

function openCart() {
    if (cart.length > 0) {
        d('aside').style.left = 'auto';
        d('aside').classList.add('show')
    } else {
        d('aside').style.left = '100vw';
        d('aside').classList.remove('show')
    }
}
d('.menu-opener-cart').addEventListener('click', openCart)

function updateCart() {
    if (cart.length > 0) {
        d('aside').classList.add('show')
        d('aside').style.left = 'auto';
        d('.cart').innerHTML = '';

        let subtotal = 0;
        let descont = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = d('.models .cart--item').cloneNode(true);

            let pizzaSize;
            switch (cart[i].size) {
                case 0:
                    pizzaSize = 'P'
                    break;
                case 1:
                    pizzaSize = 'M'
                    break;
                case 2:
                    pizzaSize = 'G'
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSize})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-name').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtplus').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtminus').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1)
                }
                updateCart();
            })

            d('.cart').append(cartItem)
        }

        descont = subtotal * 0.1;
        total = subtotal - descont

        d('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        d('.discount span:last-child').innerHTML = `R$ ${descont.toFixed(2)}`
        d('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else {
        d('aside').style.width = '-100vw';
        d('aside').classList.remove('show')
    }
}



//EVENTOS NAV
const nav = d('nav').classList
function navOpener() {
    nav.toggle('hidden')
}
d('.menu-opener').addEventListener('click', navOpener)