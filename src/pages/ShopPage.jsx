import styles from "../styles/shop-page.module.css";

import { useOutletContext } from "react-router";
import ShopCard from "../composants/shopProductCard";
import { useState } from "react";
import getRandomItems from "../utils/getRandomItems";
import { useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import useDebounce from "../hooks/useDebounce";

export default function ShopPage() {
  const { data, setCartArticles, cartArticles } = useOutletContext();
  const [category, setCategory] = useState(["all"]);
  const [searchResults, setSearchResults] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  function findArticleCartQty(id) {
    const article = cartArticles.find((elt) => elt.id == id);
    if (!article) return undefined;
    return article.count;
  }

  function handleCategoryChange(e) {
    const selectedCategory = e.target.value;
    console.log(selectedCategory);

    if (category.includes(selectedCategory)) {
      return;
    }

    setCategory([selectedCategory]);
  }

  const randomItems = useMemo(() => {
    if (category.includes("all")) {
      return getRandomItems(data, 20);
    }

    return data.filter((elt) => category.includes(elt.category));
  }, [data, category]);

  useEffect(() => {
    if (debouncedQuery) {
      const results = data.filter((article) =>
        article.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
      );
      setSearchResults(results);
      return;
    }
    if (debouncedQuery === "") {
      setSearchResults("");
      return;
    }
  }, [debouncedQuery, data, randomItems]);

  const results = searchResults ? searchResults : randomItems;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filter}>
        <div className={styles.cardCategory}>
          <label
            htmlFor="all"
            style={{
              backgroundColor: category.includes("all") ? "#86d9a8" : "",
            }}
          >
            Tous
            <input
              type="checkbox"
              value="all"
              id="all"
              checked={category.includes("all")}
              onChange={handleCategoryChange}
            />
          </label>
          <label
            htmlFor="menClothings"
            style={{
              backgroundColor: category.includes("men's clothing")
                ? "#86d9a8"
                : "",
            }}
          >
            Men clothings
            <input
              type="checkbox"
              value="men's clothing"
              id="menClothings"
              checked={category.includes("men's clothing")}
              onChange={handleCategoryChange}
            />
          </label>
          <label
            htmlFor="jewelery"
            style={{
              backgroundColor: category.includes("jewelery") ? "#86d9a8" : "",
            }}
          >
            Jewelery
            <input
              type="checkbox"
              value="jewelery"
              id="jewelery"
              checked={category.includes("jewelery")}
              onChange={handleCategoryChange}
            />
          </label>
          <label
            htmlFor="electronics"
            style={{
              backgroundColor: category.includes("electronics")
                ? "#86d9a8"
                : "",
            }}
          >
            Electronics
            <input
              type="checkbox"
              value="electronics"
              id="electronics"
              checked={category.includes("electronics")}
              onChange={handleCategoryChange}
            />
          </label>
          <label
            htmlFor="womenClothings"
            style={{
              backgroundColor: category.includes("women's clothing")
                ? "#86d9a8"
                : "",
            }}
          >
            Women clothings
            <input
              type="checkbox"
              value="women's clothing"
              id="womenClothings"
              checked={category.includes("women's clothing")}
              onChange={handleCategoryChange}
            />
          </label>
        </div>
        <form action="#">
          <div className={styles.searchSection}>
            <Icon icon="mdi:search" className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Rechercher un produit..."
              onChange={(e) => {
                setSearchQuery(e.target.value.trim());
              }}
            />
          </div>
        </form>
      </div>
      <div className={styles.container}>
        {results.map((elt) => {
          const { id, title, price, image, description, rating } = elt;

          return (
            <ShopCard
              img={image}
              title={title}
              price={price}
              id={id}
              key={id}
              description={description}
              rating={rating}
              setArticle={setCartArticles}
              cartQty={findArticleCartQty(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
