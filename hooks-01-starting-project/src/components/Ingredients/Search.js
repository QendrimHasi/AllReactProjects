import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [search, setSearch] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === inputRef.current.value) {
        const query =
          search.length === 0 ? "" : `?orderBy="title"&equalTo="${search}"`;
        fetch(
          "https://test-8ea72-default-rtdb.firebaseio.com/ingredients.json" +
            query,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadIngredients(loadedIngredients);
            // console.log(loadedIngredients);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [search, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
