/* Category content is kept independent of card rendering. No product inventory is assumed. */
window.sinadiaJewelryCategories = Object.freeze([
  Object.freeze({
    id: "necklaces",
    name: "گردنبند",
    title: "گردنبندهای سینادیا",
    image: "assets/jewelry/women-necklaces-tassel.webp",
    width: 671,
    height: 1000,
    position: "50% 70%",
    alt: "گردنبندهای لایه‌ای زنانه با مروارید، نگین‌های آبی و آویز زنجیری طلایی‌رنگ روی گردن مدل"
  }),
  Object.freeze({
    id: "rings",
    name: "انگشتر",
    title: "انگشترهای سینادیا",
    image: "assets/jewelry/rings-wood.webp",
    width: 800,
    height: 635,
    position: "50% 58%",
    alt: "انگشترهای طلایی با نگین و طرح برگ روی شاخهٔ چوبی"
  }),
  Object.freeze({
    id: "bracelets",
    name: "دستبند",
    title: "دستبندهای سینادیا",
    image: "assets/jewelry/women-bracelets-layered.webp",
    width: 1000,
    height: 794,
    position: "50% 60%",
    alt: "دستبندهای زنانهٔ زنجیری، تخت و نگین‌دار به رنگ طلایی روی پارچهٔ روشن"
  }),
  Object.freeze({
    id: "earrings",
    name: "گوشواره",
    title: "گوشواره‌های سینادیا",
    image: "assets/jewelry/women-earrings-blue.webp",
    width: 467,
    height: 634,
    position: "50% 70%",
    alt: "گوشواره‌های حلقه‌ای طلایی‌رنگ و آویز قطره‌ای با نگین آبی روی گوش مدل"
  })
]);

// Confirmed categories with the user's supplied men's jewelry images.
window.sinadiaJewelryAudiences = Object.freeze({
  women: window.sinadiaJewelryCategories,
  men: Object.freeze([
    Object.freeze({
      id: "necklaces", name: "گردنبند", title: "گردنبندهای مردانهٔ سینادیا",
      image: "assets/jewelry/men-necklaces.webp", width: 671, height: 1000,
      position: "50% 67%",
      alt: "گردنبندهای مردانه با زنجیر و آویز قطب‌نما، کنار مهره‌های تیره روی چوب"
    }),
    Object.freeze({
      id: "rings", name: "انگشتر", title: "انگشترهای مردانهٔ سینادیا",
      image: "assets/jewelry/men-rings.webp", width: 1000, height: 794,
      position: "50% 60%",
      alt: "چهار انگشتر مردانه با نقش شیر، نگین آبی و بافت چکش‌خورده روی چوب"
    }),
    Object.freeze({
      id: "bracelets", name: "دستبند", title: "دستبندهای مردانهٔ سینادیا",
      image: "assets/jewelry/men-bracelets.webp", width: 672, height: 1000,
      position: "50% 53%",
      alt: "دستبندهای مردانهٔ چرمی، مهره‌ای و زنجیری روی شاخهٔ چوبی"
    })
  ])
});
