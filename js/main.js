// トップページ：カード一覧を描画
(function () {
  const grid = document.getElementById("card-grid");
  const countEl = document.getElementById("recipe-count");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (!grid) return;

  const frag = document.createDocumentFragment();

  RECIPES.forEach((recipe, i) => {
    const li = document.createElement("li");
    li.className = "card";
    li.style.setProperty("--i", i);

    const a = document.createElement("a");
    a.className = "card__link";
    a.href = `recipe.html?id=${recipe.id}`;

    a.innerHTML = `
      <div class="card__media">
        <img class="card__img" src="${recipe.image}" alt="${recipe.name}" loading="lazy" />
        ${recipe.servings ? `<span class="card__badge">${recipe.servings}</span>` : ""}
      </div>
      <div class="card__body">
        <h3 class="card__title">${recipe.name}</h3>
        <p class="card__catch">${recipe.catch || ""}</p>
        <span class="card__cta">レシピを見る <span class="card__cta-arrow">→</span></span>
      </div>
    `;

    li.appendChild(a);
    frag.appendChild(li);
  });

  grid.appendChild(frag);
  if (countEl) countEl.textContent = RECIPES.length;

  // スクロールで順にふわっと出現
  const cards = grid.querySelectorAll(".card");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add("is-visible"));
  }
})();
