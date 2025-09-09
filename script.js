// ----------------- DOM Elements -----------------
const categoriesContainer = document.getElementById('categories-container');
const cardContainer = document.getElementById('card-container');

// ----------------- Load Categories -----------------
async function loadCategories() {
  try {
    const res = await fetch('https://openapi.programming-hero.com/api/categories');
    const data = await res.json();
    const categories = data.categories;

    categories.forEach(cat => {
      categoryMap[cat.id] = cat.category_name;
    });

    // "All Trees" button
    const allLi = document.createElement('li');
    allLi.innerHTML = `<a href="#" data-id="all" class="block px-3 py-2 text-sm rounded-md font-normal mt-1 hover:bg-green-700">All Trees</a>`;
    categoriesContainer.appendChild(allLi);
    allLi.querySelector('a').addEventListener('click', e => {
      e.preventDefault();
      highlightCategory(allLi.querySelector('a'));
      loadAllPlants();
    });

    categories.forEach(category => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" data-id="${category.id}" class="block px-3 py-2 text-sm font-normal mt-1 rounded-md hover:bg-green-700">${category.category_name}</a>`;
      categoriesContainer.appendChild(li);

      li.querySelector('a').addEventListener('click', e => {
        e.preventDefault();
        highlightCategory(li.querySelector('a'));
        loadPlantsByCategory(category.id);
      });
    });
  } catch (err) {
    console.error(err);
    categoriesContainer.innerHTML = `<p class="text-red-500">Categories did not loaded </p>`;
  }
}

// Highlight selected category
function highlightCategory(selected) {
  categoriesContainer.querySelectorAll('a').forEach(a => {
    a.classList.remove('bg-green-700', 'text-white');
  });
  selected.classList.add('bg-green-700', 'text-white');
}

// ----------------- Load Plants -----------------
async function loadAllPlants() {
  try {
    showLoader();
    const res = await fetch('https://openapi.programming-hero.com/api/plants');
    const data = await res.json();
    renderPlants(data.plants);
  } catch (err) {
    console.error(err);
    cardContainer.innerHTML = `<p class="text-red-500">Plants did not loaded </p>`;
  } finally {
    hideLoader();
  }
}

async function loadPlantsByCategory(id) {
  try {
    showLoader();
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    renderPlants(data.plants);
  } catch (err) {
    console.error(err);
    cardContainer.innerHTML = `<p class="text-red-500">Plants did not loaded </p>`;
  } finally {
    hideLoader();
  }
}

// ----------------- Render Cards -----------------
function renderPlants(plants) {
  cardContainer.innerHTML = '';
  if (!plants || plants.length === 0) {
    cardContainer.innerHTML = `<p class="text-gray-600">Trees are not available 🌱</p>`;
    return;
  }

  plants.forEach(plant => {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl shadow-md p-4 flex flex-col ';

    const plantCategory = plant.category || categoryMap[plant.category_id] || 'Unknown';

    div.innerHTML = `
      <img class="w-60 h-40 object-cover rounded-lg cursor-pointer" src="${plant.image}" alt="${plant.name}" />
      <h3 class="mt-2 font-semibold text-lg cursor-pointer">${plant.name}</h3>
      <p class="mt-1 text-gray-500  text-sm">${plant.description.slice(0, 60)}...</p>
      <div class="mt-2 w-full flex justify-between items-center ">
        <p class="bg-[#dcfce7] px-4 py-1 rounded-2xl text-green-700">${plantCategory}</p>
        <p class="font-semibold text-green-700">৳ ${plant.price}</p>
      </div>
      <button class="mt-3 bg-[#15803d] hover:bg-amber-700 text-white py-1 px-14 rounded-2xl add-to-cart">
        Add to Cart
      </button>
    `;
    cardContainer.appendChild(div);

    // Add to Cart button
    div.querySelector('.add-to-cart').addEventListener('click', () => {
      addToCart(plant);
      alert(`${plant.name} has been added to cart!`);
    });

    // Open Modal when name or image clicked
    div.querySelector('h3').addEventListener('click', () => openPlantModal(plant.id));
    
  });
}

// ----------------- Modal -----------------
async function openPlantModal(id) {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    const plant = data.plants;

    modalContent.innerHTML = `
      <h2 class="text-2xl font-bold mb-2">${plant.name}</h2>
      <img class="w-full h-60 object-cover rounded-lg mb-4" src="${plant.image}" alt="${plant.name}" />
      <p class="text-gray-600 mb-2">${plant.description}</p>
      <p class="font-semibold text-green-700 mb-1">Category: ${plant.category}</p>
      <p class="font-semibold text-green-700 mb-1">Price: ৳ ${plant.price}</p>
    `;
    modal.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    modalContent.innerHTML = `<p class="text-red-500">Plant details Not loaded </p>`;
    modal.classList.remove('hidden');
  }
}

// ----------------- Cart Functions -----------------
function addToCart(plant) {
  const cartItemsList = document.getElementById('cart-items');
  if (cartItems.includes(plant.id)) return;

  cartItems.push(plant.id);
  totalPrice += plant.price;

  const li = document.createElement('li');
  li.className = 'flex justify-between bg-[#f0fdf4] p-2 rounded-md shadow m-2';
   li.innerHTML = `
    <div class="flex flex-col text-left">
      <span class="font-semibold">${plant.name}</span>
      <span class="text-green-700">৳ ${plant.price}</span>
    </div>
    <button class="remove-cart text-red-500 font-bold ml-2">❌</button>
  `;
  cartItemsList.appendChild(li);

  li.querySelector('.remove-cart').addEventListener('click', () => removeFromCart(li, plant));
  updateTotal();
}


// Cart
const cartContainer = document.createElement('div');

cartContainer.innerHTML = `
  <ul id="cart-items" class="space-y-2"></ul>
  <p id="total-price" class="mt-2 font-semibold text-right mr-3 text-green-700"></p>
`;
document.querySelector('.right-card-value').appendChild(cartContainer);

let categoryMap = {};
let totalPrice = 0;
let cartItems = [];


function removeFromCart(li, plant) {
  li.remove();
  cartItems = cartItems.filter(id => id !== plant.id);
  totalPrice -= plant.price;
  updateTotal();
}

function updateTotal() {
  document.getElementById('total-price').textContent = `Total: ৳ ${totalPrice}`;
}


const loader = document.createElement('div');
loader.className = 'col-span-5 flex justify-center items-center py-10 hidden';
loader.innerHTML = `
  <div class="flex space-x-2">
    <div class="w-3 h-3 bg-black rounded-full animate-bounce"></div>
    <div class="w-3 h-3 bg-black rounded-full animate-bounce delay-200"></div>
    <div class="w-3 h-3 bg-black rounded-full animate-bounce delay-400"></div>
  </div>
`;
cardContainer.parentElement.insertBefore(loader, cardContainer);

// -- Modal --
const modal = document.createElement('div');
modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50';
modal.innerHTML = `
  <div class="bg-white p-6 rounded-lg w-11/12 max-w-lg relative">
  <div id="modalContent"></div>
  <button 
    id="closeModal" 
    class="absolute bottom-3 right-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-300 transition">
    Close
  </button>
</div>
`;
document.body.appendChild(modal);

const modalContent = modal.querySelector('#modalContent');
const closeModal = modal.querySelector('#closeModal');
closeModal.addEventListener('click', () => modal.classList.add('hidden'));

// -- Loader Functions --
function showLoader() {
  cardContainer.innerHTML = `
    <div class="flex justify-center items-center h-40 w-full">
      <span class="loading loading-dots loading-xl"></span>
    </div>
  `;
}

function hideLoader() {
  loader.classList.add('hidden');
  cardContainer.classList.remove('hidden');
}


// ----------------- Initial Load -----------------
loadCategories();
loadAllPlants();
