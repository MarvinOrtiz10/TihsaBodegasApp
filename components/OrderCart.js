import React, { useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import CartItem from "./CartItem";

const OrderCart = React.memo(({ showPacking, showPicking, orderDetails, onToggle, renderEdit }) => {
  const renderItem = useCallback(
    ({ item }) => (
      <CartItem
        item={item}
        onPress={onToggle}
        showPacking={showPacking}
        showPicking={showPicking}
        showCost={false}
        showEdit={true}
        renderEdit={renderEdit ? renderEdit(item) : null}

      />
    ),
    [onToggle]
  );

  return (
    <FlashList
       data={orderDetails}
      renderItem={renderItem}
      keyExtractor={(item) => item.Codigo.toString()}
      estimatedItemSize={170}
      removeClippedSubviews
    />
  );
});

export default OrderCart;
