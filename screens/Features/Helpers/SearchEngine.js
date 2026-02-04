//Versión 3.1.0 - Filtro para mostrar primero herramientas y luego repuestos 
import Fuse from "fuse.js";

const removeAccents = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// Función para preprocesar los datos
const preprocessDataOnce = (data, fields) => {
  return data.map((item) => {
    const allTokens = fields.reduce((tokens, field) => {
      const fieldValue = removeAccents(String(item[field])).toUpperCase();
      const fieldTokens = fieldValue.split(" ");
      return [...tokens, ...fieldTokens];
    }, []);

    return { ...item, AllTokens: [...new Set(allTokens)] };
  });
};

const searchEngineAdvance = (data, text, sortBy = null, sortOrder = "asc") => {
  const textClean = removeAccents(text).toUpperCase(); // Convertir el texto de búsqueda a mayúsculas

  let resultadosFiltrados = data.filter((resultado) => {
    const tokensConsulta = textClean.split(" ");
    const allTokensResultado = resultado.AllTokens;

    // Verificar si al menos una parte de una palabra de la consulta coincide con AllTokens
    return tokensConsulta.every((token) =>
      allTokensResultado.some((resultToken) => resultToken.includes(token))
    );
  });

  // Ordenar los resultados por existencia de manera descendente
  resultadosFiltrados.sort((a, b) => {
    if (a.Existencia < b.Existencia) {
      return sortOrder === "desc" ? -1 : 1;
    }
    if (a.Existencia > b.Existencia) {
      return sortOrder === "desc" ? 1 : -1;
    }
    return 0;
  });

  if (sortBy) {
    resultadosFiltrados.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      // Lista de CodTarticulo que son repuestos en inglés
      const spareParts = [11013, 3600, 3500, 20022, 1999];

      if (sortBy === "CodTarticulo") {
        const indexA = spareParts.indexOf(valueA);
        const indexB = spareParts.indexOf(valueB);

        if (indexA === -1 && indexB === -1) {
          // Ninguno de los valores está en spareParts, ordenar normalmente
          if (valueA < valueB) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortOrder === "asc" ? 1 : -1;
          }
        } else if (indexA === -1) {
          // Solo B está en spareParts
          return -1;
        } else if (indexB === -1) {
          // Solo A está en spareParts
          return 1;
        } else {
          // Ambos están en spareParts, ordenar según su posición en la lista
          return indexA - indexB;
        }
      } else {
        if (valueA < valueB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortOrder === "asc" ? 1 : -1;
        }
      }
      return 0;
    });
  }

  return resultadosFiltrados;
};



export { preprocessDataOnce, searchEngineAdvance };

//Versión 3.0 - Se agrego un parametro para ordenar la data que devuelve el parametro puede ser cualquiera y el orden puede ser descendiente o ascendente
/* import Fuse from "fuse.js";

function removeAccents(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Función para preprocesar los datos
function preprocessDataOnce(data, fields) {
  return data.map((item) => {
    const allTokens = fields.reduce((tokens, field) => {
      const fieldValue = removeAccents(String(item[field])).toUpperCase();
      const fieldTokens = fieldValue.split(" ");
      return [...tokens, ...fieldTokens];
    }, []);

    return { ...item, AllTokens: [...new Set(allTokens)] };
  });
}

function searchEngineAdvance(data, text, sortBy = null, sortOrder = "asc") {
  const textClean = removeAccents(text).toUpperCase(); // Convertir el texto de búsqueda a mayúsculas

  let resultadosFiltrados = data.filter((resultado) => {
    const tokensConsulta = textClean.split(" ");
    const allTokensResultado = resultado.AllTokens;

    // Verificar si al menos una parte de una palabra de la consulta coincide con AllTokens
    return tokensConsulta.every((token) =>
      allTokensResultado.some((resultToken) => resultToken.includes(token))
    );
  });

  // Ordenar por sortBy y luego por Existencia
  resultadosFiltrados.sort((a, b) => {
    if (a[sortBy] === b[sortBy]) {
      // Si los valores de sortBy son iguales, ordenar por Existencia de mayor a menor
      return sortOrder === "asc"
        ? b.Existencia - a.Existencia
        : a.Existencia - b.Existencia;
    } else {
      // Si los valores de sortBy son diferentes, ordenar por sortBy
      if (a[sortBy] < b[sortBy]) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    }
  });

  return resultadosFiltrados;
}

export { preprocessDataOnce, searchEngineAdvance }; */
//Versión 2.0 - Está versión permite pasar por parametros los Keys de búsqueda, haciendo universal el motor de búsqueda
/*import Fuse from "fuse.js";

function removeAccents(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
// Función para preprocesar los datos
function preprocessDataOnce(data, fields) {
  return data.map((item) => {
    const allTokens = fields.reduce((tokens, field) => {
      const fieldValue = removeAccents(String(item[field])).toUpperCase();
      const fieldTokens = fieldValue.split(" ");
      return [...tokens, ...fieldTokens];
    }, []);

    return { ...item, AllTokens: [...new Set(allTokens)] };
  });
}
function searchEngineAdvance(data, text) {
  const textClean = removeAccents(text).toUpperCase(); // Convertir el texto de búsqueda a mayúsculas

  const resultadosFiltrados = data.filter((resultado) => {
    const tokensConsulta = textClean.split(" ");
    const allTokensResultado = resultado.AllTokens;

    // Verificar si al menos una parte de una palabra de la consulta coincide con AllTokens
    return tokensConsulta.every((token) =>
      allTokensResultado.some((resultToken) => resultToken.includes(token))
    );
  });
  return resultadosFiltrados;
}
export { preprocessDataOnce, searchEngineAdvance };
*/
//Versión 1.1 Prueba -> modificación en búsqueda, se agregaron Keywords asociados para mejorar la búsqueda
//Necesita mejorar, hay que ajustar los parametros de búsqueda
/*import Fuse from "fuse.js";

function removeAccents(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Función de preprocesamiento para calcular las keywords
function preprocessData(data) {
  return data.map((item) => {
    // Tokenize Codigo, NombreArticulo, and normalize Keywords
    const tokensCodigo = item.Codigo.toUpperCase().split(" ");
    const tokensNombre = removeAccents(item.NombreArticulo)
      .toUpperCase()
      .split(" ");
    const tokensKeywords = item.Keywords.map((keyword) =>
      removeAccents(keyword.trim()).toUpperCase()
    );

    // Combine all tokens and remove duplicates
    const allTokens = [
      ...new Set([...tokensCodigo, ...tokensNombre, ...tokensKeywords]),
    ];

    return { ...item, AllTokens: allTokens };
  });
}

function searchEngineAdvance(data, text) {
  // Preprocesar datos fuera de la función de búsqueda
  const preprocessedData = preprocessData(data);
  const textClean = removeAccents(text).toUpperCase(); // Convertir el texto de búsqueda a mayúsculas

  const fuseOptions = {
    keys: ["Codigo", "NombreArticulo", "Keywords", "AllTokens"], // Incluir AllTokens en las claves de búsqueda
    includeScore: true,
    threshold: 0.6,
    tokenize: true,
  };

  const newFuse = new Fuse(preprocessedData, fuseOptions);
  const resultados = newFuse.search(textClean);

  // Filtrar resultados para que contengan al menos una parte de una palabra de la consulta
  const resultadosFiltrados = resultados.filter((resultado) => {
    const tokensConsulta = textClean.split(" ");
    const allTokensResultado = resultado.item.AllTokens;

    // Verificar si al menos una parte de una palabra de la consulta coincide con AllTokens
    return tokensConsulta.every((token) =>
      allTokensResultado.some((resultToken) => resultToken.includes(token))
    );
  });

  // Limitar el número de resultados si es necesario
  const maxResultados = 50; // ajustar según tus necesidades
  return resultadosFiltrados
    .slice(0, maxResultados)
    .map((resultado) => resultado.item);
}

export default searchEngineAdvance;
*/
//Versión 1.0 Beta Estable
/*import Fuse from "fuse.js";

function removeAccents(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
function searchEngineAdvance(data, text) {
  const textClean = removeAccents(text);
  const fuseOptions = {
    keys: [
      { name: "Codigo", weight: 0.5 }, // Clave para los códigos con ponderación alta
      { name: "NombreArticulo", weight: 0.5 }, // Clave para los nombres con ponderación menor
    ],
    includeScore: true,
    threshold: 0.6,
    tokenize: true,
  };

  const newFuse = new Fuse(data, fuseOptions);
  const resultados = newFuse.search(textClean);

  // Filtrar resultados para que contengan todas las palabras de la consulta
  const resultadosFiltrados = resultados.filter((resultado) => {
    const tokensConsulta = textClean.toUpperCase().split(" ");
    const textoResultadoCodigo = resultado.item.Codigo.toUpperCase();
    const textoResultadoNombre = resultado.item.NombreArticulo.toUpperCase();

    // Verificar si alguna de las palabras de la consulta coincide con Codigo o NombreArticulo
    return tokensConsulta.every(
      (token) =>
        textoResultadoCodigo.includes(token) ||
        textoResultadoNombre.includes(token)
    );
  });

  return resultadosFiltrados.map((resultado) => resultado.item);
}
export default searchEngineAdvance;*/
