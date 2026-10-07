// 1. Nested data se saare products ek array me nikalo
function getAllProducts() {
  const all = [];
  for (const category of storeData.categories) {
    for (const sub of category.subcategories) {
      for (const product of sub.products) {
        all.push(product);
      }
    }
  }
  return all;
}

// 2. Price ke hisaab se sort (sirf ek baar)
const sortedProducts = getAllProducts().sort((a, b) => a.price - b.price);

// 3. Binary search: pehla index jahan price >= target ho
function lowerBound(target) {
  let low = 0;
  let high = sortedProducts.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedProducts[mid].price < target) {
      low = mid + 1;   // left half hata do
    } else {
      high = mid;      // right half hata do
    }
  }
  return low;
}

// 4. Target ke sabse paas wale 'count' products
function findClosest(target, count = 3) {
  const n = sortedProducts.length;
  let right = lowerBound(target);
  let left = right - 1;
  const result = [];

  while (result.length < count && (left >= 0 || right < n)) {
    if (left < 0) {
      result.push(sortedProducts[right++]);
    } else if (right >= n) {
      result.push(sortedProducts[left--]);
    } else {
      const diffLeft = target - sortedProducts[left].price;
      const diffRight = sortedProducts[right].price - target;
      if (diffLeft <= diffRight) {
        result.push(sortedProducts[left--]);
      } else {
        result.push(sortedProducts[right++]);
      }
    }
  }

  // price ke order me dikhane ke liye
  return result.sort((a, b) => a.price - b.price);
}

// 5. Range me products (min se max tak)
function findInRange(min, max) {
  const start = lowerBound(min);       // pehla price >= min
  const end = lowerBound(max + 1);     // pehla price > max
  return sortedProducts.slice(start, end);
}

// 6. Cards dikhana
function showProducts(products) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  for (const p of products) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
      <p>Brand: ${p.brand}</p>
      <p>⭐ ${p.rating}</p>
      <button onclick="viewProduct('${p.id}')">View Product</button>
    `;
    container.appendChild(card);
  }
}

// 7. View Product button
function viewProduct(id) {
  const p = sortedProducts.find((item) => item.id === id);
  alert(
    p.name + "\n" +
    "Price: ₹" + p.price + "\n" +
    "Brand: " + p.brand + "\n" +
    "Rating: " + p.rating + " (" + p.reviews + " reviews)\n" +
    "Stock: " + p.stock
  );
}

// 8. Button events
document.getElementById("searchBtn").addEventListener("click", () => {
  const target = Number(document.getElementById("targetPrice").value);
  if (!target) {
    alert("Please enter a price");
    return;
  }
  document.getElementById("resultTitle").textContent = "Closest Products";
  showProducts(findClosest(target, 3));
});

document.getElementById("rangeBtn").addEventListener("click", () => {
  const min = Number(document.getElementById("minPrice").value);
  const max = Number(document.getElementById("maxPrice").value);
  if (!min || !max || min > max) {
    alert("Please enter valid min and max price");
    return;
  }
  document.getElementById("resultTitle").textContent = "Products in Range";
  showProducts(findInRange(min, max));
});