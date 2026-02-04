import React, { useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import CartItem from "./CartItem";

const RequisitionCart = React.memo(({ showPacking, showCost, showEdit, renderEdit, details, onToggle }) => {
  const renderItem = useCallback(
    ({ item }) => (
      <CartItem
        item={item}
        onPress={onToggle}
        showPacking={showPacking}
        showCost={showCost}
        showEdit={showEdit}
        renderEdit={renderEdit ? renderEdit(item) : null}
      />
    ),
    [onToggle]
  );

  return (
    <FlashList
       data={details}
      renderItem={renderItem}
      keyExtractor={(item) => item.Codigo.toString()}
      estimatedItemSize={170}
      removeClippedSubviews
    />
  );
});

export default RequisitionCart;
