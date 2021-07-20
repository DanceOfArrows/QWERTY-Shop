import { useState } from "react";
import { motion } from "framer-motion";
import { formatPhoneNumber } from "react-phone-number-input";
import { NavLink } from "react-router-dom";

import { countries } from "./AddAddress/select-vars";
import { pageVariants } from "./Home";

const Profile = (props: any) => {
  document.title = "QWERTY Shop - Profile";
  const tabToSet = props.location.state ? props.location.state.tab : null;
  const userInfo = props.checkCachedUser();
  const addressesCopy =
    userInfo.addresses && userInfo.addresses.length > 0
      ? userInfo.addresses.slice()
      : [];
  const orders =
    userInfo.orders && userInfo.orders.length > 0 ? userInfo.orders : [];
  const [currentProfileTab, setCurrentProfileTab] = useState(
    tabToSet ? tabToSet : "orders"
  );
  const [displayAddressIdx, setDisplayAddressIdx] = useState<null | number>(
    null
  );

  const renderTab = (currentProfileTab: any) => {
    switch (currentProfileTab) {
      case "orders":
        return (
          <>
            <div className="qwerty-shop-profile-label-left">Orders</div>
            <div className="qwerty-shop-profile-orders-container">
              {orders && orders.length > 0
                ? [...orders]
                    .sort((a: any, b: any) =>
                      a.order_date < b.order_date ? 1 : -1
                    )
                    .map((order: any, idx: number) => {
                      const { address, items, order_date } = order;
                      const {
                        address_line_one,
                        address_line_two,
                        city,
                        country,
                        full_name,
                        phone_number,
                        state,
                        zip_code,
                      } = address;

                      const months = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];

                      const dateConverted = new Date(Date.parse(order_date));
                      const month = months[dateConverted.getMonth()];
                      const date = dateConverted.getDate();
                      const year = dateConverted.getFullYear();

                      const countryToDisplay = countries.filter(
                        (countryItem) => countryItem.value === country
                      )[0].label;

                      return (
                        <div
                          key={`qwerty-shop-profile-order-${idx}`}
                          className="qwerty-shop-profile-order-item"
                          style={idx !== 0 ? { marginTop: "48px" } : {}}
                        >
                          <div className="qwerty-shop-profile-order-text">
                            <div>
                              <div style={{ fontWeight: "bold" }}>
                                Order Placed:
                              </div>
                              <div>
                                {month} {date}, {year}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontWeight: "bold" }}>Ship To:</div>
                              <div
                                className="qwerty-shop-order-address-wrapper"
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "flex-end",
                                }}
                              >
                                <div
                                  className="qwerty-shop-profile-order-address-name"
                                  onMouseOver={() => setDisplayAddressIdx(idx)}
                                  onMouseLeave={() =>
                                    setDisplayAddressIdx(null)
                                  }
                                >
                                  {full_name}
                                </div>
                                <div
                                  className="qwerty-shop-profile-order-address"
                                  style={
                                    displayAddressIdx !== idx
                                      ? { opacity: 0 }
                                      : { opacity: 1 }
                                  }
                                >
                                  <div className="qwerty-shop-address-full_name">
                                    {full_name}
                                  </div>
                                  <div>{address_line_one}</div>
                                  {address_line_two.length > 0 ? (
                                    <div>{address_line_two}</div>
                                  ) : null}
                                  <div>
                                    {city}, {state} {zip_code}
                                  </div>
                                  <div>{countryToDisplay}</div>
                                  <div>
                                    Phone: {formatPhoneNumber(phone_number)}
                                  </div>
                                </div>
                                <div
                                  className="fas fa-angle-down"
                                  style={{ marginLeft: "6px" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="qwerty-shop-cart-items-container">
                            {items && items.length > 0 ? (
                              items.map((orderItem: any, itemIdx: number) => {
                                const { item, item_variation, quantity } =
                                  orderItem;
                                const { id: itemId, name } = item;
                                const {
                                  id: itemVariationId,
                                  image,
                                  option,
                                  variant,
                                  price,
                                } = item_variation;
                                const displayPrice =
                                  parseFloat(price).toFixed(2);

                                return (
                                  <div
                                    className="qwerty-shop-cart-item"
                                    key={`Order-${idx}-item-${itemIdx}-variant-${itemVariationId}`}
                                  >
                                    <img
                                      className="qwerty-shop-cart-item-image"
                                      src={image}
                                      alt="item"
                                    />
                                    <div className="qwerty-shop-cart-item-info-container">
                                      <NavLink
                                        to={`/item/${itemId}`}
                                        className="qwerty-shop-cart-item-info-name"
                                      >
                                        {name}
                                      </NavLink>
                                      <div>
                                        Option:{" "}
                                        <span className="qwerty-shop-cart-item-info-color">
                                          {option}
                                        </span>{" "}
                                      </div>
                                      <div>
                                        Variant:{" "}
                                        <span className="qwerty-shop-cart-item-info-size">
                                          {variant}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="qwerty-shop-cart-item-price">
                                        Price per: ${displayPrice}
                                      </div>
                                      <div className="qwerty-shop-cart-item-quantity">
                                        Qty: {quantity}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div style={{ textAlign: "center" }}>
                                Failed to load items
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                : null}
            </div>
          </>
        );
      case "addresses":
        return (
          <>
            <div className="qwerty-shop-profile-label-left">Addresses</div>
            <div className="qwerty-shop-profile-addresses-container">
              <NavLink to="/addaddress">
                <div className="qwerty-shop-profile-addresses-add">
                  <span>
                    <i className="fas fa-plus"></i>
                  </span>
                  Add Address
                </div>
              </NavLink>
              {addressesCopy
                .sort((a: any, b: any) => {
                  const aVal = a.default ? 1 : -1;
                  const bVal = b.default ? 1 : -1;

                  return bVal - aVal;
                })
                .map((address: any, idx: number) => {
                  const {
                    address_line_one,
                    address_line_two,
                    city,
                    country,
                    full_name,
                    phone_number,
                    state,
                    zip_code,
                  } = address;

                  const countryToDisplay = countries.filter(
                    (countryItem) => countryItem.value === country
                  )[0].label;
                  if (idx !== 0 && idx % 5 === 0) return null;

                  return (
                    <div
                      key={`qwerty-shop-address-${idx}`}
                      className="qwerty-shop-address-item"
                      style={
                        idx === 0
                          ? {
                              borderImageSlice: 1,
                              borderImageSource:
                                "linear-gradient(to right, #880383, #21BFFE)",
                            }
                          : {}
                      }
                    >
                      <div className="qwerty-shop-address-full_name">
                        {full_name}
                      </div>
                      <div>{address_line_one}</div>
                      {address_line_two.length > 0 ? (
                        <div>{address_line_two}</div>
                      ) : null}
                      <div>
                        {city}, {state} {zip_code}
                      </div>
                      <div>{countryToDisplay}</div>
                      <div>Phone: {formatPhoneNumber(phone_number)}</div>
                      {idx === 0 ? (
                        <div
                          style={{
                            alignSelf: "center",
                            margin: "auto 0 24px 0",
                            padding: 0,
                          }}
                        >
                          Default
                        </div>
                      ) : null}
                    </div>
                  );
                })}
            </div>
          </>
        );
    }
  };

  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5 }}
      variants={pageVariants}
      className="qwerty-shop-app-page-transition"
    >
      <div className="qwerty-shop-profile">
        <div className="qwerty-shop-profile-left">
          {renderTab(currentProfileTab)}
        </div>
        <div className="qwerty-shop-profile-right">
          <div
            className={
              currentProfileTab === "orders"
                ? "qwerty-shop-profile-nav-label qwerty-shop-profile-nav-label-selected"
                : "qwerty-shop-profile-nav-label"
            }
            onClick={() => {
              if (currentProfileTab !== "orders")
                setCurrentProfileTab("orders");
            }}
            style={{ borderRadius: "0 12px 0 0", marginTop: "24px" }}
          >
            Orders
          </div>
          <div
            className={
              currentProfileTab === "addresses"
                ? "qwerty-shop-profile-nav-label qwerty-shop-profile-nav-label-selected"
                : "qwerty-shop-profile-nav-label"
            }
            onClick={() => {
              if (currentProfileTab !== "addresses")
                setCurrentProfileTab("addresses");
            }}
          >
            Adresses
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
