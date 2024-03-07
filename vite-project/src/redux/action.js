
import axios from "axios";

export const GET_PRODUCTOS="GET_PRODUCTOS";
export const  ADD_PRODUCT= "ADD_PRODUCT";
export const SEARCH_ID="SEARCH_ID";
export const PAGINADO="PAGINADO";
export const ADD_USUARIO="ADD_USUARIO";
export const INI_USUARIO="INI_USUARIO";
export const FILTER="FILTER";
export const ORDER="ORDER";
export const CARGAR_CLIENTE="CARGAR_CLIENTE";
export const CERRAR_SESION="CERRAR_SESION";
export const AGREGAR_AL_CARRITO = 'AGREGAR_AL_CARRITO';
export const ELIMINAR_PRODUCTO_CARRITO="ELIMINAR_PRODUCTO_CARRITO";
export const VACIAR_CARRITO="VACIAR_CARRITO";
export const AGREGAR_FAV=" AGREGAR_FAV";
export const ELIMINAR_PRODUCTO_FAV="ELIMINAR_PRODUCTO_FAV";
export const CAMBIO="CAMBIO";
export const BORRAR_PRODUCTO="BORRAR_PRODUCTO";
export const PEDIDO="PEDIDO";
export const ACTUALIZAR_VARIANTES="ACTUALIZAR_VARIANTES";
export const ACTUALIZAR_CARRITO="ACTUALIZAR_CARRITO";
export const BUSCAR_NOMBRE="BUSCAR_NOMBRE";
export const CHECK_EMAIL_EXISTENCE_REQUEST = 'CHECK_EMAIL_EXISTENCE_REQUEST';
export const CHECK_EMAIL_EXISTENCE_SUCCESS = 'CHECK_EMAIL_EXISTENCE_SUCCESS';
export const CHECK_EMAIL_EXISTENCE_FAILURE = 'CHECK_EMAIL_EXISTENCE_FAILURE';
// export const  OBTENER_INFO_USUARIO=" OBTENER_INFO_USUARIO";
export const GET_PEDIDOS='GET_PEDIDOS';
export const GET_CLIENTES='GET_CLIENTES';
export const ENVIAR_ESTADO='ENVIAR_ESTADO';
export const DESPACHAR_PRODUCTO = 'DESPACHAR_PRODUCTO';

export const getProductos = () => {
    return async function (dispatch) {
        try {
            const response = await axios.get(`http://localhost:3004/producto/producto`);

          // console.log("asi llega la info:",response)
            

             dispatch({
                type: GET_PRODUCTOS,
                payload: response.data,
           });
       } catch (error) {
           console.error(error);
        }
     };
 };

 export const getAllClientes=()=>{
  return async function(dispatch){
    try{
      const response =await axios.get(`http://localhost:3004/cliente/allClientes`)

      dispatch({
        type:GET_CLIENTES,
        payload:response.data,
      });
    }catch(error){
      console.error(error);
    }
  }
 }

 export const getPedidos=()=>{
  return async function(dispatch){
    try{
      const response = await axios.get(`http://localhost:3004/pedido/Lpedidos`)
      console.log(response.data)
      dispatch({
        type:GET_PEDIDOS,
        payload:response.data,
      });
    }catch(error){
      console.error(error);
    }
  }
 }

 export const addProduct = (productData) => {

  console.log("Imágenes que se envían al servidor:", productData.getAll('imagenes'));
  return async function (dispatch) {
    try {
      const response = await axios.post(`http://localhost:3004/producto/nuevoProducto`, productData);
      console.log("Respuesta del servidor:", response.data);
  
      dispatch({
          type: ADD_PRODUCT,
          payload: response.data, // Puedes ajustar esto dependiendo de la estructura de datos devuelta por el servidor
      });
  } catch (error) {
      if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error('Respuesta del servidor:', error.response.data);
          console.error('Código de estado HTTP:', error.response.status);
      } else if (error.request) {
          // La solicitud se hizo pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor:', error.request);
      } else {
          // Ocurrió un error al configurar la solicitud
          console.error('Error al configurar la solicitud:', error.message);
      }
      console.error('Error completo:', error.config);
  }
  };
};


 export const getById = (id) => {
    return async function (dispatch) {
      try {
        const response = await axios.get(`http://localhost:3004/producto/ProductoId/${id}`);
  
        if (response.data) {
          dispatch({
            type: SEARCH_ID,
            payload: response.data
          });
        } else {
          console.log("No se encontraron resultados");
          dispatch({
            type: SEARCH_ID,
            payload: {}, // Establecer payload como un objeto vacío o null, no como una cadena vacía
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  export function paginado(order){
    return async function(dispatch){
      try{
        dispatch({
          type:PAGINADO,
          payload:order
        })
      }catch(error){
        alert(error.response.data.error)
      }
    }
  }

  export const filterProduc = (filtro) => {
    return async function (dispatch) {
    
    
      try {
        dispatch({
          type: FILTER,
          payload: filtro,
          
        });
      } catch (error) {
        console.error(error);
      }
    };
  };

  export function orderProducto(orderAux){
    return async function(dispatch){
        try {
            dispatch({
               type: ORDER,
               payload: orderAux
            })
        } catch (error) {
            alert(error.response.data.error)
        }
    }
  }

  export const createUsuario = (userData) => {

    return async function (dispatch) {
      try {
        const response = await axios.post(`http://localhost:3004/cliente/nuevoCliente`, userData);
        dispatch({
          type: ADD_USUARIO, // Ajusta este tipo de acción según tu configuración de Redux
          payload: response.data, // Puedes ajustar esto dependiendo de la estructura de datos devuelta por el servidor
        });
      } catch (error) {
        console.error(error);
      }
    };
  };

  export const ingresarUsuario = (userData) => {
    return async function (dispatch) {
        try {
           

            const response = await axios.post(`http://localhost:3004/cliente/login`, userData);

           

            if (response.status === 200) {
                if (response.data) {
                    dispatch({
                        type: INI_USUARIO,
                        payload: response.data,
                    });
                } else {
                    console.error('No se recibieron datos en la respuesta del servidor');
                }
            } else {
              
                throw new Error('Error en la solicitud: Código de estado ' + response.status);
            }
            
            // Devolver la respuesta del servidor para que pueda ser manejada en el componente
            return response;
        } catch (error) {
            console.error('Error en la solicitud:', error);
            console.error('Error capturado:', error);
            throw error;
        }
    };
};

// export const obtenerInformacionUsuario = (correo, contraseña) => {
//   return async function (dispatch) {
//     try {
//       const response = await axios.post(`http://localhost:3004/cliente/InfoUsuario`, { correo, contraseña });

//       console.log("Respuesta del servidor al obtener información del usuario:", response);

//       if (response.status === 200) {
//         if (response.data && response.data.user) {
//           // Si hay datos de usuario en la respuesta, actualiza el estado con la información del usuario
//           dispatch({
//             type: OBTENER_INFO_USUARIO,
//             payload: response.data.user,
//           });
//         } else {
//           console.error('No se recibieron datos de usuario en la respuesta del servidor');
//           // Podrías establecer un mensaje de error en el estado de tu aplicación si lo deseas
//         }
//       } else {
//         console.error('El servidor respondió con un código de estado diferente a 200:', response.status);
//         // Manejo de errores para códigos de estado no exitosos
//         // Por ejemplo, puedes lanzar una excepción para que se maneje en el bloque catch
//         throw new Error('Error en la solicitud: Código de estado ' + response.status);
//       }
//     } catch (error) {
//       console.error('Error en la solicitud:', error);
//       // Aquí puedes manejar el error de manera adecuada, como establecer un mensaje de error en el estado
//       // También podrías lanzar una nueva excepción si necesitas manejarla más arriba en la pila de llamadas
//       throw error;
//     }
//   };
// };


  export const obtenerClientePorId = (id) => {
    return async function(dispatch) {
      try {
        const response = await axios.get(`http://localhost:3004/cliente/cliente/${id}`);
        
        if (response.status !== 200) {
          throw new Error('Error al obtener el cliente por ID');
        }
  
        dispatch({
          type:CARGAR_CLIENTE, // Aquí usamos la acción 'CARGAR_CLIENTE' para cargar la información del cliente
          payload: response.data,
        });
      } catch (error) {
        dispatch({
          type:'OBTENER_CLIENTE_POR_ID_ERROR',
          payload: error.message,
        });
      }
    };
  };
  

  export const cerrarSesion = () => {
   
    return {
      type: CERRAR_SESION,
    };
  };

  

export const agregarAlCarrito = (producto) => {
  return {
    type: AGREGAR_AL_CARRITO,
    payload: producto,
  };
};

export const eliminarProductoCarrito = (index) => {
  return {
    type: ELIMINAR_PRODUCTO_CARRITO,
    payload: index,
  };
};

export const vaciarCarrito = () => {
  return {
    type: VACIAR_CARRITO,
  };
};

export const agregarFav = (producto) => {
  return {
    type: AGREGAR_FAV,
    payload: producto,
  };
};

export const eliminarFav= (index) => {
  return {
    type: ELIMINAR_PRODUCTO_FAV,
    payload: index,
  };
};

export const cambios = (id, producto) => {
  return async function (dispatch) {
    try {
      console.log('Datos que se envían para la actualización:', { id, producto }); // Agrega este console.log para ver lo que se envía
      const response = await axios.patch(`http://localhost:3004/producto/editar/${id}`, producto);
      dispatch({
        type: CAMBIO,
        payload: response.data,
      });
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // Puedes realizar alguna acción aquí en caso de error, como enviar un mensaje de error al usuario o realizar otras operaciones necesarias.
      if (error.response) {
        // Si la solicitud fue realizada y el servidor respondió con un status code fuera del rango 2xx
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Código de estado HTTP:', error.response.status);
      } else if (error.request) {
        // Si la solicitud fue realizada pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        // Si ocurrió un error al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
      }
      // Aquí podrías ejecutar alguna acción específica para manejar el error, como dispatch a un estado de error en Redux, mostrar un mensaje al usuario, etc.
      throw error; // Vuelve a lanzar el error para que otros componentes puedan manejarlo si es necesario.
    }
  };
};

export const borrar=async(id)=>{
  try{

    const borrar=await axios.delete(`http://localhost:3004/producto/eliminar/${id}`)

    if (borrar.status !== 200) {
      throw new Error('Error al obtener el cliente por ID');
    }

    dispatch({
      type:BORRAR_PRODUCTO, // Aquí usamos la acción 'CARGAR_CLIENTE' para cargar la información del cliente
      payload: borrar.data,
    });
  } catch (error) {
    console.error('Error :', error);
  }
};

export const addPedido = (productos) => {
  console.log("Datos del producto que se envían al comprar:", productos);
  return async function () {
    try {
      const response = await axios.post('http://localhost:3004/pedido/nuevoPedido', {
        productos: productos,
      });

      console.log("respuesta", response);

      return response; // Devuelve la respuesta del servidor
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export const actualizarVariante = (id, cantidad_disponible) => {
  return async function (dispatch) {
    try {
      

      // Realizar la solicitud PATCH al servidor
      const response = await axios.patch(`http://localhost:3004/producto/cambio/${id}`, {
        cantidad_disponible: cantidad_disponible // Ajuste aquí para obtener el valor directamente
      });

   

      // Despachar la acción después de que la solicitud sea exitosa
      dispatch({
        type: ACTUALIZAR_VARIANTES,
        payload: { id, cantidad_disponible },
      });

    } catch (error) {
      console.error("Error al actualizar variante:", error);
      // Puedes manejar el error de alguna manera si es necesario
    }
  };
};

export const actualizarCarrito = (nuevoCarrito) => ({
  type:ACTUALIZAR_CARRITO,
  payload: nuevoCarrito,
});


export const buscar=(name)=>{
  return async function (dispatch){
    try{

      console.log("esto se busca",name)
      const response = await axios.get(`http://localhost:3004/producto/name/${name}`);



      if(response.data.length > 0){
        dispatch({
          type:BUSCAR_NOMBRE,
          payload: response.data,
        });
      }
    }catch(error){
      console.error(error)
    }
  }
}

export const checkEmailExistence = (correo) => {
  return async (dispatch) => {
    dispatch({ type: CHECK_EMAIL_EXISTENCE_REQUEST });

    try {
      const response = await axios.get('/check', { params: { correo } });

      // Si la solicitud fue exitosa, envía el resultado al reducer
      console.log("Respuesta del servidor:", response.data);
      dispatch({
        type: CHECK_EMAIL_EXISTENCE_SUCCESS,
        payload: response.data // Esto debería ser el mensaje del servidor
      });
    } catch (error) {
      // Si hubo un error en la solicitud, envía el error al reducer
      console.error("Error al verificar el correo electrónico:", error.message);
      dispatch({
        type: CHECK_EMAIL_EXISTENCE_FAILURE,
        error: error.message // Esto debería ser el mensaje de error del servidor
      });
    }
  };
};


export const enviarEstado = (nuevoEstado) => ({
  type:ENVIAR_ESTADO,
  payload: nuevoEstado,
});

export const despacharProducto = (pedidoId, detalleId) => {
  return {
    type:DESPACHAR_PRODUCTO,
    payload: { pedidoId, detalleId }
  };
};