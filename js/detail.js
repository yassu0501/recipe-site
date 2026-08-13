// 詳細ページ：?id= のレシピを描画
(function () {
  const root = document.getElementById("detail-root");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const recipe = RECIPES.find((r) => r.id === id);

  if (!recipe) {
    root.innerHTML = `
      <div class="not-found">
        <p class="not-found__emoji">🍽️</p>
        <h1>レシピが見つかりませんでした</h1>
        <a href="index.html" class="btn">一覧にもどる</a>
      </div>`;
    return;
  }

  document.title = `${recipe.name} | おうちレシピ帖`;

  const ingredientsHtml = recipe.ingredientGroups
    .map((group) => {
      const rows = group.items
        .map(
          (item) => `
        <li class="ing__row">
          <span class="ing__name">${item.name}</span>
          <span class="ing__dots" aria-hidden="true"></span>
          <span class="ing__amount">${item.amount}</span>
        </li>`
        )
        .join("");
      return `
        ${group.title ? `<h3 class="ing__group">${group.title}</h3>` : ""}
        <ul class="ing__list">${rows}</ul>`;
    })
    .join("");

  const stepsHtml = recipe.steps
    .map(
      (step, i) => `
      <li class="step" style="--s:${i}">
        <span class="step__num">${i + 1}</span>
        <p class="step__text">${step}</p>
      </li>`
    )
    .join("");

  root.innerHTML = `
    <article class="recipe">
      <div class="recipe__hero">
        <div class="recipe__hero-media">
          <img src="${recipe.image}" alt="${recipe.name}" />
        </div>
        <div class="recipe__hero-info">
          ${recipe.servings ? `<span class="recipe__servings">${recipe.servings}</span>` : ""}
          <h1 class="recipe__title">${recipe.name}</h1>
          <p class="recipe__catch">${recipe.catch || ""}</p>
        </div>
      </div>

      <div class="recipe__grid">
        <section class="panel panel--ing">
          <h2 class="panel__title"><span class="panel__icon">🧺</span>材料</h2>
          ${ingredientsHtml}
        </section>

        <section class="panel panel--steps">
          <h2 class="panel__title"><span class="panel__icon">🍳</span>作り方</h2>
          <ol class="step__list">${stepsHtml}</ol>
        </section>
      </div>

      <div class="recipe__foot">
        <a href="index.html" class="btn">‹ 一覧にもどる</a>
      </div>
    </article>
  `;

  // 出現アニメーション
  requestAnimationFrame(() => {
    root.querySelector(".recipe")?.classList.add("is-in");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      root.querySelectorAll(".step, .panel").forEach((el) => io.observe(el));
    } else {
      root.querySelectorAll(".step, .panel").forEach((el) => el.classList.add("is-visible"));
    }
  });
})();
