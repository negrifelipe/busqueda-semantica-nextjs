# Busqueda Semantica

En una aplicación, por ejemplo una tienda de plugins para juegos, muchas veces los usuarios al buscar un producto, escriben una oracion.

Muchos sistemas implementan **full-text search** pero esto tiene un **problema** y es que busca en base a las palabras que escribe el usuario y no tiene en cuenta el significado.

Supongamos que el usuario busca `Plugin que sincroniza permisos entre servidores`, el full-text search muy probablemente no arroje ningún resultado util y esto es lo que queremos solucionar con la búsqueda semántica.

En la búsqueda semántica, la búsqueda se realiza en base al significado y no en base a que las palabras coincidan.

Tambien puede ser utilizada para que al final de la pagina de un producto, el mostar productos reomendados en base a la marca del producto y el vector del producto.

No necesariamente la busqueda semantica es mejor que la de texto completo, tambien se podria considerar primero hacer busqueda de texto completo y filtrar/ordenar esos resultados con busqueda semantica para mostrar los mas relevantes.

## Ventajas

- El significado de las palabras es el protagonista a la hora de buscar
- Soporta realizar preguntas
- Es tolerante a errores de ortografía
- Aunque la informacion este en otro idioma, aun asi se realizara la busqueda

## Desventajas

- Necesitamos una base de datos que soporte almacenar e indexar vectores
- Necesitamos un modelo de representación vectorial que sea capaz de generar vectores para cada uno de nuestros productos y para cada query que escriban los usuarios
- Dependiendo del modelo que utilicemos los resultados pueden variar así como también el tamaño que ocuparán nuestros vectores

## Cómo funciona

Seguiremos utilizando el ejemplo de que estamos en una tienda de plugins.

Para cada producto creado lo que haremos es convertir la información del producto en un vector de números de n dimensiones, la cantidad de dimensiones depende del modelo de representación vectorial que utilizaremos.

Este proceso de convertir la información en un vector lo realizará un modelo de representación vectorial. Este vector será la posicion del significado de la información en el espacio. Vectores con un significado similar están más cerca los unos de los otros mientras que si el significado es completamente diferente estarán más lejos.

Cuando recibimos una query por parte de un usuario, al igual que como hicimos con la información del producto, lo convertiremos en un vector. Luego procederemos a buscar, en la base de datos, los vectores de información de producto más cercanos al de la query. Estos vectores serán los resultados de la búsqueda.

---

## Implementacion

### Pila Tecnologica

- Next.js - Para construir un monolito que contenga el interfaz de usuario y el backend.
- PostgreSQL - Base de datos para alamacenar productos y vectores utilizando `pgvector`.
- text-embedding-3-small - Modelo para generar representaciones vectoriales de texto provisto por OpenAI con 1536 dimensiones.
