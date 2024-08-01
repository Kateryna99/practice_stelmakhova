/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    item => product.categoryId === item.id,
  );
  const user = category
    ? usersFromServer.find(item => category.ownerId === item.id)
    : null;

  return {
    ...product,
    category,
    user,
  };
});

function getFilteredGoodsList(goodsList, filterName, query, categories) {
  let filteredGoods = JSON.parse(JSON.stringify(goodsList));

  if (filterName) {
    filteredGoods = filteredGoods.filter(good => good.user.name === filterName);
  }

  if (query) {
    filteredGoods = filteredGoods.filter(good =>
      good.name.toLowerCase().includes(query.toLowerCase().trim()),
    );
  }

  if (categories.length) {
    filteredGoods = filteredGoods.filter(good =>
      categories.includes(good.category.title),
    );
  }

  return filteredGoods;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const goodsToShow = getFilteredGoodsList(
    products,
    selectedUser,
    query,
    selectedCategories,
  );
  const isFemale = sex => sex === 'f';
  const reset = () => {
    setSelectedUser('');
    setQuery('');
    setSelectedCategories([]);
  };

  const handleCategoryClick = categoryTitle => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(categoryTitle)) {
        return prevCategories.filter(cat => cat !== categoryTitle);
      }

      return [...prevCategories, categoryTitle];
    });
  };

  const isArrayEmpty = array => array.length === 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({
                  'is-active': !selectedUser.length,
                })}
                onClick={() => setSelectedUser('')}
              >
                All
              </a>

              {usersFromServer.map(user => {
                return (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    className={classNames({
                      'is-active': selectedUser === user.name,
                    })}
                    onClick={() => setSelectedUser(user.name)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button', 'is-success', 'mr-6', {
                  'is-outlined': !isArrayEmpty(selectedCategories),
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {categoriesFromServer.map(item => (
                <a
                  key={item.id}
                  data-cy="Category"
                  className={classNames('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategories.includes(item.title),
                  })}
                  href="#/"
                  onClick={() => handleCategoryClick(item.title)}
                >
                  {item.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => reset()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {isArrayEmpty(goodsToShow) && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            {!isArrayEmpty(goodsToShow) && (
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
            )}

            <tbody>
              {goodsToShow.map(product => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.category.icon} - {product.category.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={classNames('has-text-link', {
                      'has-text-danger': isFemale(product.user.sex),
                    })}
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
