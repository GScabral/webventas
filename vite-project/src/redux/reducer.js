
import {
  GET_PRODUCTOS,
  ADD_PRODUCT,
  SEARCH_ID,
  PAGINADO,
  INI_USUARIO,
  FILTER,
  ORDER,
  CARGAR_CLIENTE,
  CERRAR_SESION,
  AGREGAR_AL_CARRITO,
  ELIMINAR_PRODUCTO_CARRITO,
  VACIAR_CARRITO,
  AGREGAR_FAV,
  ELIMINAR_PRODUCTO_FAV,
  CAMBIO,
  BORRAR_PRODUCTO,
  PEDIDO,
  ACTUALIZAR_VARIANTES,
  ACTUALIZAR_CARRITO,
  BUSCAR_NOMBRE,
  CHECK_EMAIL_EXISTENCE_REQUEST,
  CHECK_EMAIL_EXISTENCE_SUCCESS,
  CHECK_EMAIL_EXISTENCE_FAILURE,
  ADD_USUARIO,
  // OBTENER_INFO_USUARIO,
  GET_PEDIDOS,
  GET_CLIENTES,
} from "./action"

const initialState = {
  allProductos: [],
  allProductosBackUp: [],
  totalPages: 1,
  currentPage: 1,
  info: [],
  filter: false,
  allClientes: [],
  allClientesBackUp: [],
  carrito: [],
  orderProducto: [],
  filtered: [],
  cliente: null,
  fav: [],
  loading: false,
  errorMessage: '',
  emailExists: false,
  allPedidos:[],
  allPedidosBackup:[],
  isLoggedIn: false, 
}

const ITEMS_PER_PAGE = 12;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTOS:
      const allProductos = action.payload; // Obtener todos los productos

      // Dividir los productos según la cantidad que quieres mostrar por página
      const slicedProductos = allProductos.slice(0, ITEMS_PER_PAGE);

      return {
        ...state,
        allProductos: slicedProductos, // Almacenar solo los productos para la primera página
        allProductosBackUp: allProductos,
        totalPages: Math.ceil(allProductos.length / ITEMS_PER_PAGE), // Actualizar el total de páginas
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    case ADD_PRODUCT:

      const newProducto = action.payload;

      return {
        ...state,
        allProductos: [newProducto, ...state.allProductos],
        allProductosBackUp: [newProducto, ...state.allProductosBackUp]
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case SEARCH_ID:
      return {
        ...state,
        info: action.payload,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case PAGINADO:
      if (action.payload === "reset") {
        return {
          ...state,
          currentPage: 1,
        }
      } else {
        const nextPage = action.payload === "next" ? state.currentPage + 1 : state.currentPage - 1;
        const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        if (state.filter) {
          if (startIndex >= state.filtered.length || startIndex < 0) return state;
        } else {
          if (startIndex >= state.allProductosBackUp.length || startIndex < 0) return state;
        }

        return {
          ...state,
          allProductos: state.allProductosBackUp.slice(startIndex, endIndex),
          currentPage: nextPage,
        }
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case INI_USUARIO:
      console.log("Datos del usuario que se cargan en el estado:", action.payload);
      const userInfo = action.payload; // Ajusta esta línea según la estructura de datos que recibes

      return {
        ...state,
        isLoggedIn:true,
        cliente: userInfo, // Puedes incluir más propiedades del usuario si las recibes del servidor
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case ORDER:
      const newSortOrder = action.payload;
    
      // Verificar si el nuevo tipo de orden es una cadena vacía
      const isClearOrder = newSortOrder === "";
    
      // Si el nuevo tipo de orden es una cadena vacía, restablecer al estado original sin orden aplicado
      if (isClearOrder) {
          return {
              ...state,
              allProductos: state.allProductosBackUp.slice(0, ITEMS_PER_PAGE), // Restaurar al estado original sin orden aplicado
              sortOrder: "", // Limpiar el tipo de orden
          };
      }
    
      // Si el nuevo tipo de orden no es una cadena vacía, aplicar el orden seleccionado
      let ordenarProducto = [];
    
      if (newSortOrder === "precioAsc") {
          ordenarProducto = [...state.allProductosBackUp].sort((prev, next) => prev.precio - next.precio);
      } else if (newSortOrder === "precioDesc") {
          ordenarProducto = [...state.allProductosBackUp].sort((prev, next) => next.precio - prev.precio);
      }
    
      return {
          ...state,
          allProductos: ordenarProducto.slice(0, ITEMS_PER_PAGE), // Aplicar el nuevo orden a la primera página
          allProductosBackUp: ordenarProducto,
          sortOrder: newSortOrder,
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    case FILTER:
      const { categoria, talles } = action.payload;
      let filteredProducts = state.allProductosBackUp;

      if (categoria) {
        const categoriaFiltrada = categoria.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (producto) => producto.categoria.toLowerCase() === categoriaFiltrada
        );
      }

      if (talles) {
        const tallesFiltrados = talles.toLowerCase();
        filteredProducts = filteredProducts.filter((producto) =>
          Array.isArray(producto.talles) &&
          producto.talles.some(
            (talle) => talle.toLowerCase() === tallesFiltrados
          )
        );
      }

      const totalFilteredItems = filteredProducts.length;
      const totalPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE);

      const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;

      const paginatedFilteredProducts = filteredProducts.slice(startIndex, endIndex);

      
      return {
        ...state,
        allProductos: paginatedFilteredProducts,
        filtered: filteredProducts, // Cambia "filterProductos" a "filtered"
        filter: true,
        totalPages: totalPages,
        filters: { ...state.filters, categoria: categoria, talles: talles },
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    case CARGAR_CLIENTE:
      return {
        ...state,
        cliente: action.payload // Actualiza la información del cliente en el estado
      };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    case CERRAR_SESION:
      return {
        ...state,
        isLoggedIn: false,
        usuario: null,
        cliente: null, // Agrega aquí cualquier otro estado relacionado con la sesión que necesites limpiar
      };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    case AGREGAR_AL_CARRITO:
      const nuevoProducto = action.payload;
      return {
        ...state,
        carrito: [...state.carrito, nuevoProducto],
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    case ELIMINAR_PRODUCTO_CARRITO:
      const index = action.payload;
      const nuevosProductos = [...state.carrito];
      nuevosProductos.splice(index, 1);
      return {
        ...state,
        carrito: nuevosProductos,
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    case VACIAR_CARRITO:
      return {
        ...state,
        carrito: [],
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    case AGREGAR_FAV:
      const nuevoFav = action.payload;
      return {
        ...state,
        fav: [...state.fav, nuevoFav]
      }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    case ELIMINAR_PRODUCTO_FAV:
      const indexFav = action.payload;
      const nuevosProductosFav = [...state.fav];
      nuevosProductosFav.splice(indexFav, 1);
      return {
        ...state,
        fav: nuevosProductosFav,
      };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    case CAMBIO:
      const productoModificado = action.payload; // Datos del producto modificado

      // Verificar que el ID del producto a modificar existe en el estado
      const productoExistente = state.allProductosBackUp.find(producto => producto.id === productoModificado.id);

      if (!productoExistente) {
        // Si el producto no existe, retorna el estado actual sin hacer cambios
        return state;
      }
      // Actualizar el producto en el estado
      const productosActualizados = state.allProductosBackUp.map(producto => {
        if (producto.id === productoModificado.id) {
          // Crear un nuevo objeto producto solo si se encuentra el ID correspondiente
          return {
            ...producto,
            cantidad: productoModificado.cantidad,
            precio: productoModificado.precio,
            // Agrega otras propiedades aquí si es necesario
          };
        }
        return producto;
      });

      return {
        ...state,
        allProductosBackUp: productosActualizados, // Actualiza el array completo de productos con el producto modificado
        // Actualiza los productos mostrados si es necesario
        allProductos: productosActualizados.slice(0, ITEMS_PER_PAGE),
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    case BORRAR_PRODUCTO:
      const productoBorrar = action.payload;

      const productosFiltrados = state.allClientesBackUp.filter(
        (producto) => producto.id !== productoBorrar
      );
      const carritoActualizado = state.carrito.filter(
        (producto) => producto.id !== productoBorrar
      );
      const favActualizado = state.fav.filter(
        (producto) => producto.id !== productoBorrar
      );

      return {
        ...state,
        allProductosBackUp: productosFiltrados, // Actualizar la lista de productos sin el producto borrado
        allProductos: productosFiltrados.slice(0, ITEMS_PER_PAGE), // Actualizar la lista mostrada si es necesario
        carrito: carritoActualizado, // Actualizar el carrito sin el producto borrado
        fav: favActualizado, // Actualizar los favoritos sin el producto borrado
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case PEDIDO:
      const productosEnCarrito = state.carrito;
    
      // Actualizar la cantidad disponible de los productos en base a lo que se ha comprado en el carrito
      const productosActualizadosCompra = state.allProductosBackUp.map(producto => {
        const cantidadEnCarrito = productosEnCarrito.filter(item => item.id === producto.id).length;
        return {
          ...producto,
          cantidad_disponible: producto.cantidad_disponible - cantidadEnCarrito,
        };
      });
    
      return {
        ...state,
        carrito: [], // Vaciar el carrito después de completar el pedido
        allProductosBackUp: productosActualizadosCompra, // Actualizar la lista completa de productos con las cantidades actualizadas
        allProductos: productosActualizadosCompra.slice(0, ITEMS_PER_PAGE), // Actualizar los productos mostrados si es necesario
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case ACTUALIZAR_VARIANTES:
  const { id, cantidad_disponible } = action.payload;

  const variantesIndex = state.carrito.findIndex((producto) => producto.id === id);

  if (variantesIndex !== -1) {
    const carritoActualizado = [...state.carrito];
    carritoActualizado[variantesIndex] = {
      ...carritoActualizado[variantesIndex], cantidad_disponible
    };
    const allProductosActualizados = state.allProductosBackUp.map(producto => {
  if (producto.id === id) {
    return {
      ...producto,
      cantidad_disponible: cantidad_disponible // Asignar cantidad_disponible como un valor directo
    }
  }
  return producto
});

    console.log("Carrito actualizado:", carritoActualizado);
    console.log("allProductos actualizado:", allProductosActualizados);

    return {
      ...state,
      carrito: carritoActualizado,
      allProductosBackUp: allProductosActualizados,
      allProductos: allProductosActualizados.slice(0, ITEMS_PER_PAGE)
    };
  }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case ACTUALIZAR_CARRITO:
      return {
        ...state,
        carrito: action.payload,
      };



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case BUSCAR_NOMBRE:
      return {
        ...state,
        allProductos: action.payload,
        allClientesBackUp: action.payload,
        filter: false,
        totalPages: Math.ceil(action.payload.length / ITEMS_PER_PAGE),
        currentPage: 1,
      }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    case CHECK_EMAIL_EXISTENCE_REQUEST:
      return {
        ...state,
        loading: true,
        errorMessage: '', // Limpiar el mensaje de error
        emailExists: false
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    case CHECK_EMAIL_EXISTENCE_SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: '',
        emailExists: action.payload.emailExists // Usar el resultado recibido del servidor
    };
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
      case CHECK_EMAIL_EXISTENCE_FAILURE:
        return {
          ...state,
          loading: false,
          errorMessage: action.error,
          emailExists: false
        };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case ADD_USUARIO:
      const nuevoUsuario = action.payload; // Obtener los datos del nuevo usuario agregado desde la respuesta del servidor
      return {
        ...state,
        allClientes: [...state.allClientes, nuevoUsuario], // Agregar el nuevo usuario al array de clientes en el estado
        // También puedes hacer otros ajustes necesarios al estado aquí
      };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case GET_PEDIDOS: // Nuevo caso para manejar la acción GET_PEDIDOS
    return {
      ...state,
      allPedidos: action.payload, // Almacena todos los pedidos recibidos del servidor
      allPedidosBackUp: action.payload, // También establece la copia de seguridad de todos los pedidos
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    case GET_CLIENTES:
      return {
        ...state,
      allClientes:action.payload,
      allClientesBackUp:action.payload,
      };
     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    default:
      return state;

  }
}


export default reducer;