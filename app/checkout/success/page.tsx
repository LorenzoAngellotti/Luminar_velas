export default function Success() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra! 🎉</h1>
      <p className="text-lg text-gray-700">
        Te enviamos un correo con los detalles del pedido.
      </p>

      <a
        href="/productos"
        className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Volver a la tienda
      </a>
    </div>
  );
}
