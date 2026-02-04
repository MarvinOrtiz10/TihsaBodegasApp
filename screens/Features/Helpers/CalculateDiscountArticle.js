export const CalculateDiscountArticle = (
  articulo,
  formasDePago,
  tipoCliente,
  creditoActivo
) => {
  const descuentosAplicados = [];

  // Recorremos el arreglo de formas de pago
  for (const formaDePago of formasDePago) {
    // Si creditoActivo es false y la forma de pago es "Crédito", continuamos con la siguiente iteración
    if (!creditoActivo && formaDePago.Codigo === "C") {
      continue;
    }
    // Inicializamos el precio del artículo sin descuento
    let precioSinDescuento = articulo.Precio;

    // Inicializamos el descuento y el nombre del descuento
    let descuentoAplicado = 0;
    let nombreDescuento = formaDePago.NombreFormaPago;

    // Verificamos si el arreglo FacDetalleFpagoApps está vacío
    if (formaDePago.FacDetalleFpagoApps.length === 0) {
      descuentoAplicado = (articulo.Precio * formaDePago.Pdescuento) / 100;
    } else {
      // Creamos una variable para seguir la pista si se encontró una coincidencia
      let seEncontroCoincidencia = false;

      // Recorremos el arreglo de descuentos de la forma de pago actual
      for (const descuento of formaDePago.FacDetalleFpagoApps) {
        // Verificamos si el artículo tiene el mismo CodTarticulo que el descuento
        if (
          articulo.CodTarticulo === parseInt(descuento.LineasAplica, 10) &&
          (tipoCliente === descuento.IdTipoCliente ||
            descuento.IdTipoCliente === null)
        ) {
          // Calculamos el descuento aplicado
          const descuentoCalculado =
            (articulo.Precio * descuento.Pdescuento) / 100;

          // Verificamos si el descuento calculado es mayor que el descuento actual
          if (descuentoCalculado > descuentoAplicado) {
            descuentoAplicado = descuentoCalculado;
          }

          // Marcamos que se encontró una coincidencia
          seEncontroCoincidencia = true;
        }
      }

      // Si no se encontró ninguna coincidencia, aplicamos el descuento general
      if (!seEncontroCoincidencia) {
        descuentoAplicado = (articulo.Precio * formaDePago.Pdescuento) / 100;
      }
    }

    // Calculamos el precio con el descuento aplicado
    const precioConDescuento = precioSinDescuento - descuentoAplicado;

    // Agregamos el descuento aplicado al arreglo de descuentos
    descuentosAplicados.push({
      nombreFormaPago: nombreDescuento,
      precioConDescuento,
    });
  }

  // Devolvemos el arreglo de descuentos aplicados
  return descuentosAplicados;
};

// Versión estable función para calcular los precios según el artículo y las formas de pago configurables
/*export const CalculateDiscountArticle = (articulo, formasDePago) => {
  const descuentosAplicados = [];

  // Recorremos el arreglo de formas de pago
  for (const formaDePago of formasDePago) {
    // Inicializamos el precio del artículo sin descuento
    let precioSinDescuento = articulo.Precio;

    // Inicializamos el descuento y el nombre del descuento
    let descuentoAplicado = 0;
    let nombreDescuento = formaDePago.NombreFormaPago;

    // Verificamos si el arreglo FacDetalleFpagoApps está vacío
    if (formaDePago.FacDetalleFpagoApps.length === 0) {
      descuentoAplicado = (articulo.Precio * formaDePago.Pdescuento) / 100;
    } else {
      // Creamos una variable para seguir la pista si se encontró una coincidencia
      let seEncontroCoincidencia = false;

      // Recorremos el arreglo de descuentos de la forma de pago actual
      for (const descuento of formaDePago.FacDetalleFpagoApps) {
        // Verificamos si el artículo tiene el mismo CodTarticulo que el descuento
        if (articulo.CodTarticulo === parseInt(descuento.LineasAplica, 10)) {
          // Calculamos el descuento aplicado
          const descuentoCalculado =
            (articulo.Precio * descuento.Pdescuento) / 100;

          // Verificamos si el descuento calculado es mayor que el descuento actual
          if (descuentoCalculado > descuentoAplicado) {
            descuentoAplicado = descuentoCalculado;
          }

          // Marcamos que se encontró una coincidencia
          seEncontroCoincidencia = true;
        }
      }

      // Si no se encontró ninguna coincidencia, aplicamos el descuento general
      if (!seEncontroCoincidencia) {
        descuentoAplicado = (articulo.Precio * formaDePago.Pdescuento) / 100;
      }
    }

    // Calculamos el precio con el descuento aplicado
    const precioConDescuento = precioSinDescuento - descuentoAplicado;

    // Agregamos el descuento aplicado al arreglo de descuentos
    descuentosAplicados.push({
      nombreFormaPago: nombreDescuento,
      precioConDescuento,
    });
  }

  // Devolvemos el arreglo de descuentos aplicados
  return descuentosAplicados;
};*/
