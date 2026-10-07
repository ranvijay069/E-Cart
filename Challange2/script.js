// 1. Saare products nikalo
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

const allProducts = getAllProducts();

// 2. Popularity = rating x reviews
function getPopularity(product) {
  return product.rating * product.reviews;
}

// 3. Simple Min Heap (sabse chhota popularity upar rehta hai)
class MinHeap {
  constructor() {
    this.data = [];
  }

  size() {
    return this.data.length;
  }

  top() {
    return this.data[0];
  }

  push(product) {
    this.data.push(product);
    let i = this.data.length - 1;
    // upar bubble karo
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (getPopularity(this.data[parent]) <= getPopularity(this.data[i])) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  // sabse upar wale ko hata kar naya product rakhna
  replaceTop(product) {
    this.data[0] = product;
    let i = 0;
    const n = this.data.length;
    // neeche bubble karo
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && getPopularity(this.data[left]) < getPopularity(this.data[smallest])) {
        smallest = left;
      }
      if (right < n && getPopularity(this.data[right]) < getPopularity(this.data[smallest])) {
        smallest = right;
      }
      if (smallest === i) break;

      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

// 4. Top K nikalna (poora sort nahi, sirf heap)
function getTopK(products, k) {
  const heap = new MinHeap();

  for (const product of products) {
    if (heap.size() < k) {
      heap.push(product);
    } else if (getPopularity(product) > getPopularity(heap.top())) {
      heap.replaceTop(product);
    }
  }

  // sirf K items hain, isliye inhe sort karna sasta hai
  return heap.data.sort((a, b) => getPopularity(b) - getPopularity(a));
}

// 5. Stars banana (rating 4.8 -> ★★★★★)
function makeStars(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

// 6. Cards dikhana
function showPopular(k) {
  const topProducts = getTopK(allProducts, k);
  const maxPopularity = getPopularity(topProducts[0]);
  const container = document.getElementById("popularList");
  container.innerHTML = "";

  topProducts.forEach((p, index) => {
    const popularity = getPopularity(p);
    const percent = (popularity / maxPopularity) * 100;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="rank">#${index + 1}</div>
      <h3>${p.name}</h3>
      <p class="stars">${makeStars(p.rating)} ${p.rating}</p>
      <p>${p.reviews} reviews</p>
      <p>Popularity: ${Math.round(popularity)}</p>
      <div class="bar-bg"><div class="bar" style="width: ${percent}%"></div></div>
    `;
    container.appendChild(card);
  });
}

// 7. Dropdown change hone par page reload kiye bina update
document.getElementById("topK").addEventListener("change", (e) => {
  showPopular(Number(e.target.value));
});

// pehli baar page khulne par Top 3
showPopular(3);