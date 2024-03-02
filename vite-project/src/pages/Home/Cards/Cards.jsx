import Card from "../Card/Card";
import './cards.css'

const Cards =({producto,agregarAlCarrito,agregarFav})=>{
    
    return(
        <div className="cards-container">
            <Card
            id={producto.id}
            nombre={producto.nombre}
            imagenes={producto.imagenes}
            categoria={producto.categoria}
            talles={producto.talles}
            precio={producto.precio}
            descripcion={producto.descripcion}
            colores={producto.colores}
            variantes={producto.variantes} 
            agregarAlCarrito={agregarAlCarrito}
            agregarFav={agregarFav}
            />
        </div>
    )
}

export default Cards;