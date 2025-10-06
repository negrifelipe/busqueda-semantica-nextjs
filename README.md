# Busqueda Semantica

En una aplicación, por ejemplo una tienda de plugins para juegos, muchas veces los usuarios al buscar un producto, escriben una oración.

Muchos sistemas implementan **full-text search** pero esto tiene un **problema** y es que busca en base a las palabras que escribe el usuario y no tiene en cuenta el significado.

Supongamos que el usuario busca `Plugin que sincroniza permisos entre servidores`, el full-text search muy probablemente no arroje ningún resultado útil y esto es lo que queremos solucionar con la búsqueda semántica.

En la búsqueda semántica, la búsqueda se realiza en base a los conceptos y no en base a que las palabras coincidan.

También puede ser utilizada para que al final de la página de un producto, el mostrar productos recomendados en base a la marca del producto y el vector del producto.

No necesariamente la búsqueda semántica es mejor que la de texto completo, también se podría considerar primero hacer búsqueda de texto completo y filtrar/ordenar esos resultados con búsqueda semántica para mostrar los más relevantes.

## Ventajas

- El significado de las palabras es el protagonista a la hora de buscar
- Soporta realizar preguntas
- Es tolerante a errores de ortografía

## Desventajas

- Necesitamos una base de datos que soporte almacenar e indexar vectores
- Necesitamos un modelo de representación vectorial que sea capaz de generar vectores para cada uno de nuestros productos y para cada query que escriban los usuarios
- Dependiendo del modelo que utilicemos los resultados pueden variar así como también el tamaño que ocuparán nuestros vectores

## Cómo funciona

Seguiremos utilizando el ejemplo de que estamos en una tienda de plugins.

Para cada producto creado lo que haremos es convertir la información del producto en un vector de números de n dimensiones, la cantidad de dimensiones depende del modelo de representación vectorial que utilizaremos. Los vectores van a estar ubicados en el espacio en base a su significado. Este [video](https://www.youtube.com/watch?v=5rvUTeb0be4) explica de forma gráfica cómo se componen y qué significan estos vectores.

Este proceso de convertir la información en un vector lo realizará un modelo de representación vectorial. Este vector será la posición del significado de la información en el espacio. Vectores con un significado similar están más cerca los unos de los otros mientras que si el significado es completamente diferente estarán más lejos.

Cuando recibimos una query por parte de un usuario, al igual que como hicimos con la información del producto, lo convertiremos en un vector. Luego procederemos a buscar, en la base de datos, los vectores de información de producto más cercanos al de la query. Estos vectores serán los resultados de la búsqueda.

---

## Implementación

### Pila Tecnológica

- Next.js - Para construir un monolito que contenga el interfaz de usuario y el backend.
- PostgreSQL - Base de datos para almacenar productos y vectores utilizando `pgvector`.
- [text-embedding-3-small](https://openai.com/index/new-embedding-models-and-api-updates/) - Modelo para generar representaciones vectoriales de texto provisto por OpenAI con 1536 dimensiones.

Utilizaré PostgreSQL ya que es la forma más simple que tengo para almacenar tanto la información del producto como el vector. También usaré el modelo `text-embedding-3-small` ya que es el más barato que OpenAI provee. Hay una gran variedad de modelos y formas de almacenar y generar los embedding, queda en cada uno analizar su caso de uso y escala que necesita.

Es importante que el modelo que utilicemos para generar los vectores de los productos sea el mismo que el que usamos para las queries que nos manden los usuarios.

### Generar el embedding

Para esto, utilizaremos el paquete `openai` que nos permitirá acceder a la API de OpenAI fácilmente sin hacer las requests a mano.

```ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  // Quedaría en ustedes el manejo de errores. Para simplicidad asumimos que la respuesta es success
  return response.data[0].embedding;
}
```

Cuando recibimos la creación de un producto llamaremos a esta función y almacenaremos el vector en la base de datos.

### Almacenar el producto

Para esto usaré prisma y la función para ejecutar una query de SQL raw, ya que prisma no soporta vectores.

```ts
const resumen = `${nombre} ${vendedor} ${descripcion}`;

const embedding = await generateEmbedding(textToEmbed);

const vectorString = `[${embedding.join(",")}]`;

await prisma.$executeRaw`
	INSERT INTO productos (nombre, vendedor, descripcion, embedding)
	VALUES (${nombre}, ${vendedor}, ${descripcion}, ${vectorString}::vector)
`;
```

Aquí hay que tener en cuenta que los modelos tienen un límite de tokens (Aproximadamente 1 token son 4 caracteres en inglés), esto dependerá del modelo que utilicemos, por lo que si el resumen es muy largo esto no funcionará.

Para solucionar esto podríamos pedirle a un modelo de lenguaje que en base a la información del producto, nos genere un resumen con los datos más importantes y luego en base a eso generar el vector.

### Buscar un producto

Aquí al igual que al crear un producto generaremos el vector para la query del usuario.

```ts
const queryEmbedding = await generateEmbedding(query);

const vectorString = `[${queryEmbedding.join(",")}]`;

// Realizar búsqueda semántica usando distancia de coseno

const resultados = await prisma.$queryRaw<ResultadoBusqueda[]>`
	SELECT
		id,
		nombre,
		vendedor,
		embedding <-> ${vectorString}::vector as distancia
	FROM productos
	WHERE embedding IS NOT NULL
	ORDER BY distancia
	LIMIT 3
`;
```

La distancia que usare es la distancia coseno, ya que el modelo `text-embedding-3-small` de OpenAI normaliza los vectores.

Recomiendo investigar [Cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity)

También lo ideal sería crear un índice en nuestra base de datos para los productos con el embedding. Ahí quedará en cada uno investigar y evaluar cuál le conviene en base a su uso y base de datos.
